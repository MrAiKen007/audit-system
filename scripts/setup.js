#!/usr/bin/env node

import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

console.log(chalk.blue.bold('=== Audit System Claude Plugin Setup ===\n'));

async function setup() {
  try {
    // 1. Verify installation structure
    console.log(chalk.yellow('1. Verifying installation structure...'));
    
    const requiredDirs = ['agents', 'skills', 'obsidian-vault', 'scripts'];
    const requiredFiles = ['config.json', 'claude-plugin.json', 'package.json'];
    
    for (const dir of requiredDirs) {
      const dirPath = path.join(rootDir, dir);
      if (!await fs.pathExists(dirPath)) {
        throw new Error(`Missing required directory: ${dir}`);
      }
      console.log(chalk.green(`   ${dir}/ - OK`));
    }
    
    for (const file of requiredFiles) {
      const filePath = path.join(rootDir, file);
      if (!await fs.pathExists(filePath)) {
        throw new Error(`Missing required file: ${file}`);
      }
      console.log(chalk.green(`   ${file} - OK`));
    }
    
    // 2. Create .windsurf directory structure for workflows
    console.log(chalk.yellow('\n2. Setting up Claude Code workflows...'));
    
    const windsurfDir = path.join(rootDir, '.windsurf');
    const workflowsDir = path.join(windsurfDir, 'workflows');
    
    await fs.ensureDir(workflowsDir);
    
    // Create audit-connect workflow
    const auditConnectWorkflow = `---
description: Connect audit-system to current project and activate all resources
---

# Audit Connect Workflow

This workflow activates the multi-agent audit framework for any project.

## Usage

Run this workflow when in any project directory that needs security auditing:

\`\`\`bash
/audit-connect
\`\`\`

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

\`\`\`bash
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
\`\`\`

## After Connection

Once connected, use these commands:

\`\`\`bash
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
\`\`\`

## Output

All results are saved in \`./audit-output/\`:
- assumptions-[timestamp].md
- economic-analysis-[timestamp].md
- state-transitions-[timestamp].md
- composition-vulns-[timestamp].md
- exploits/ (PoC contracts)
- tests/ (Foundry test suites)
- report.md (final report)
`;

    await fs.writeFile(path.join(workflowsDir, 'audit-connect.md'), auditConnectWorkflow);
    
    // Create audit-agent workflow
    const auditAgentWorkflow = `---
description: Execute specific audit agent for targeted analysis
---

# Audit Agent Workflow

Execute specialized audit agents for different phases of security analysis.

## Available Agents

### Phase Specialists

\`\`\`bash
/audit-agent assumption     # Phase 1: Break developer assumptions
/audit-agent economic       # Phase 3: Economic attack modeling  
/audit-agent state          # Phase 4: State machine hacking
/audit-agent composition    # Phase 5: Composition attacks
\`\`\`

### Implementation Agents

\`\`\`bash
/audit-agent exploit        # Generate proof-of-concept exploits
/audit-agent test           # Generate comprehensive test suites
/audit-agent report         # Compile professional audit report
\`\`\`

### Workflow Commands

\`\`\`bash
/audit-agent full           # Execute all agents in sequence
/audit-agent quick          # Fast assessment (assumption + economic)
\`\`\`

## Usage Examples

\`\`\`bash
# Target specific contract
/audit-agent assumption --target=./contracts/Pool.sol

# Full audit on all contracts
/audit-agent full --target=./contracts/

# Generate exploit for specific vulnerability
/audit-agent exploit --target=./vulnerability-findings.md
\`\`\`

## Agent Outputs

Each agent saves results in \`./audit-output/\` with timestamped files.

## Dependencies

Must run \`/audit-connect\` first to activate the system.
`;

    await fs.writeFile(path.join(workflowsDir, 'audit-agent.md'), auditAgentWorkflow);
    
    console.log(chalk.green('   Workflows created in .windsurf/workflows/'));
    
    // 3. Verify agents configuration
    console.log(chalk.yellow('\n3. Verifying agents configuration...'));
    
    const agentsDir = path.join(rootDir, 'agents');
    const agentFiles = await fs.readdir(agentsDir);
    
    const requiredAgents = [
      'orchestrator.json',
      'assumption-analyzer.json', 
      'economic-attacker.json',
      'state-machine-hacker.json',
      'composition-attacker.json',
      'exploit-writer.json',
      'test-generator.json',
      'report-writer.json'
    ];
    
    for (const agent of requiredAgents) {
      if (!agentFiles.includes(agent)) {
        throw new Error(`Missing agent configuration: ${agent}`);
      }
      console.log(chalk.green(`   ${agent} - OK`));
    }
    
    // 4. Create installation marker
    const installMarker = path.join(rootDir, '.claude-installed');
    await fs.writeFile(installMarker, new Date().toISOString());
    
    console.log(chalk.green('\n=== Setup Complete! ==='));
    console.log(chalk.white('\nThe Audit System plugin is ready for use with Claude Code.'));
    console.log(chalk.cyan('\nNext steps:'));
    console.log(chalk.cyan('1. Navigate to any project directory'));
    console.log(chalk.cyan('2. Run: /audit-connect'));
    console.log(chalk.cyan('3. Start auditing: /audit-agent full'));
    
  } catch (error) {
    console.error(chalk.red('\nSetup failed:'), error.message);
    process.exit(1);
  }
}

setup();
