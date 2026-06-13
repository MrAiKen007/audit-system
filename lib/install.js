import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import { getPackagePath, getProjectPath, getAuditSystemDir, getClaudeDir, copyDir, writeJson } from './utils.js';
import { detectLanguageSync, formatLanguage } from './detect-lang.js';

const AGENTS_LIST = [
  'orchestrator',
  'assumption-analyzer',
  'economic-attacker',
  'state-machine-hacker',
  'composition-attacker',
  'exploit-writer',
  'test-generator',
  'report-writer',
];

const SKILLS_LIST = [
  'audit-connect',
  'auditor',
  'novel-discovery',
  'exploit-generator',
  'test-generator',
];

export async function install(options = {}) {
  const projectPath = options.projectPath || getProjectPath();
  const forceLang = options.lang || null;
  const auditDir = getAuditSystemDir(projectPath);
  const claudeDir = getClaudeDir(projectPath);
  const packagePath = getPackagePath();

  console.log(chalk.blue.bold('\n=== Audit System Installer ===\n'));

  // 1. Detect language
  let lang = forceLang || detectLanguageSync(projectPath);
  if (!lang) {
    console.log(chalk.yellow('⚠  Nenhuma linguagem detectada automaticamente.'));
    console.log(chalk.yellow('   Use --lang=solidity ou --lang=rust para forçar.\n'));
  }
  console.log(chalk.white(`📂 Projeto: ${projectPath}`));
  console.log(chalk.white(`🌐 Linguagem: ${formatLanguage(lang)}\n`));

  // 2. Create .audit-system directory
  console.log(chalk.yellow('1. Criando .audit-system/...'));
  await fs.ensureDir(auditDir);

  // 3. Copy agents
  console.log(chalk.yellow('2. Copiando agents...'));
  const agentsDest = path.join(auditDir, 'agents');
  await copyDir(path.join(packagePath, 'agents'), agentsDest);
  console.log(chalk.green(`   ✓ ${AGENTS_LIST.length} agents copiados`));

  // 4. Copy skills
  console.log(chalk.yellow('3. Copiando skills...'));
  const skillsDest = path.join(auditDir, 'skills');
  await copyDir(path.join(packagePath, 'skills'), skillsDest);
  console.log(chalk.green(`   ✓ ${SKILLS_LIST.length} skills copiadas`));

  // 5. Copy vault
  console.log(chalk.yellow('4. Copiando knowledge base...'));
  const vaultDest = path.join(auditDir, 'vault');
  await copyDir(path.join(packagePath, 'obsidian-vault'), vaultDest);
  console.log(chalk.green('   ✓ Knowledge base copiada'));

  // 6. Copy config
  console.log(chalk.yellow('5. Copiando configuração...'));
  const configSrc = path.join(packagePath, 'config.json');
  const configDest = path.join(auditDir, 'config.json');
  await fs.copy(configSrc, configDest);
  console.log(chalk.green('   ✓ Configuração copiada'));

  // 7. Write .env file with paths
  console.log(chalk.yellow('6. Configurando variáveis...'));
  const envContent = [
    `AUDIT_SYSTEM_PATH="${auditDir}"`,
    `AUDIT_AGENTS_PATH="${path.join(auditDir, 'agents')}"`,
    `AUDIT_SKILLS_PATH="${path.join(auditDir, 'skills')}"`,
    `AUDIT_VAULT_PATH="${path.join(auditDir, 'vault')}"`,
    `AUDIT_LANG="${lang || 'auto'}"`,
    `AUDIT_OUTPUT_PATH="${path.join(projectPath, 'audit-output')}"`,
    `AUDIT_MODEL="auto-detect"`,
    ``,
  ].join('\n');
  await fs.writeFile(path.join(auditDir, '.env'), envContent);
  console.log(chalk.green('   ✓ Variáveis configuradas'));

  // 8. Create .claude/ configuration
  console.log(chalk.yellow('7. Configurando Claude Code...'));
  const claudeSkillsDir = path.join(claudeDir, 'skills');
  await fs.ensureDir(claudeSkillsDir);

  // Copy the main skill to .claude/skills/
  const mainSkillSrc = path.join(skillsDest, 'audit-connect.md');
  const mainSkillDest = path.join(claudeSkillsDir, 'audit-connect.md');
  if (await fs.pathExists(mainSkillSrc)) {
    await fs.copy(mainSkillSrc, mainSkillDest);
  }

  // Create settings.json
  const settingsPath = path.join(claudeDir, 'settings.json');
  const settings = {
    skills: {
      'audit-connect': {
        description: 'Connect audit-system to current project and activate all resources',
        type: 'prompt',
        file: 'skills/audit-connect.md',
      },
      'audit-agent': {
        description: 'Execute specific audit agent',
        type: 'prompt',
        file: 'skills/audit-connect.md',
      },
      'audit-status': {
        description: 'Show audit-system connection status',
        type: 'prompt',
        file: 'skills/audit-connect.md',
      },
      'audit-agents': {
        description: 'List all available audit agents',
        type: 'prompt',
        file: 'skills/audit-connect.md',
      },
    },
  };
  await writeJson(settingsPath, settings);
  console.log(chalk.green('   ✓ Claude Code configurado'));

  // 9. Summary
  console.log(chalk.blue.bold('\n=== Instalação Completa! ===\n'));
  console.log(chalk.white('Resumo:'));
  console.log(chalk.cyan(`  📁 .audit-system/    → Agents, skills, vault, config`));
  console.log(chalk.cyan(`  📁 .claude/           → Configuração do Claude Code`));
  console.log(chalk.cyan(`  🌐 Linguagem         → ${formatLanguage(lang)}`));
  console.log(chalk.cyan(`  🤖 Agents            → ${AGENTS_LIST.length} especialistas`));
  console.log(chalk.cyan(`  📝 Skills            → ${SKILLS_LIST.length} prompts`));
  console.log(chalk.cyan(`  📚 Vault             → Knowledge base completo\n`));

  console.log(chalk.white('Próximo passo:'));
  console.log(chalk.green('  No Claude Code, digite: /audit-connect\n'));

  return { lang, auditDir, claudeDir };
}

export async function showStatus(options = {}) {
  const projectPath = options.projectPath || getProjectPath();
  const auditDir = getAuditSystemDir(projectPath);
  const claudeDir = getClaudeDir(projectPath);

  const hasAuditDir = await fs.pathExists(auditDir);
  const hasClaudeDir = await fs.pathExists(claudeDir);
  const lang = detectLanguageSync(projectPath);

  console.log(chalk.blue.bold('\n=== Audit System Status ===\n'));
  console.log(chalk.white(`📂 Projeto: ${projectPath}`));
  console.log(chalk.white(`🌐 Linguagem: ${formatLanguage(lang)}`));
  console.log(chalk.white(`📁 .audit-system/: ${hasAuditDir ? chalk.green('✓') : chalk.red('✗')}`));
  console.log(chalk.white(`📁 .claude/: ${hasClaudeDir ? chalk.green('✓') : chalk.red('✗')}`));
  console.log();

  if (hasAuditDir && hasClaudeDir) {
    console.log(chalk.green('✓ Sistema instalado e configurado.'));
    console.log(chalk.cyan('  Abra o Claude Code e digite /audit-connect\n'));
  } else {
    console.log(chalk.yellow('⚠ Sistema não está instalado neste projeto.'));
    console.log(chalk.cyan('  Execute: npx audit-system connect\n'));
  }
}

export async function listAgents() {
  console.log(chalk.blue.bold('\n=== Audit System Agents ===\n'));
  const agents = [
    ['orchestrator', 'Coordinator', 'Coordena workflows multi-agente'],
    ['assumption-analyzer', 'Specialist', 'Phase 1: Quebra de suposições'],
    ['economic-attacker', 'Specialist', 'Phase 3: Modelagem econômica'],
    ['state-machine-hacker', 'Specialist', 'Phase 4: Máquina de estados'],
    ['composition-attacker', 'Specialist', 'Phase 5: Ataques por composição'],
    ['exploit-writer', 'Implementer', 'PoCs em Solidity ou Rust/Anchor'],
    ['test-generator', 'Implementer', 'Testes Foundry ou Anchor'],
    ['report-writer', 'Documenter', 'Relatórios profissionais'],
  ];
  for (const [name, type, desc] of agents) {
    console.log(chalk.cyan(`  ${name.padEnd(22)} ${type.padEnd(14)} ${desc}`));
  }
  console.log(chalk.white('\n  LANG-aware: ajustam análise para Solidity ou Rust.\n'));
}

export async function doctor(options = {}) {
  const projectPath = options.projectPath || getProjectPath();
  const auditDir = getAuditSystemDir(projectPath);
  let allOk = true;

  console.log(chalk.blue.bold('\n=== Audit System Doctor ===\n'));

  // Check Node version
  const nodeVer = process.version;
  const major = parseInt(nodeVer.slice(1).split('.')[0]);
  const nodeOk = major >= 16;
  console.log(`${nodeOk ? chalk.green('✓') : chalk.red('✗')} Node.js: ${nodeVer} ${nodeOk ? '' : '(requer >= 16)'}`);
  if (!nodeOk) allOk = false;

  // Check audit-system directory
  const hasAudit = await fs.pathExists(auditDir);
  console.log(`${hasAudit ? chalk.green('✓') : chalk.red('✗')} .audit-system/: ${hasAudit ? 'Encontrado' : 'Não encontrado'}`);
  if (!hasAudit) allOk = false;

  // Check agents
  if (hasAudit) {
    const agentsDir = path.join(auditDir, 'agents');
    const hasAgents = await fs.pathExists(agentsDir);
    console.log(`${hasAgents ? chalk.green('✓') : chalk.red('✗')} Agents: ${hasAgents ? 'Presentes' : 'Ausentes'}`);
    if (!hasAgents) allOk = false;
  }

  // Check Claude config
  const hasClaude = await fs.pathExists(getClaudeDir(projectPath));
  console.log(`${hasClaude ? chalk.green('✓') : chalk.yellow('⚠')} .claude/: ${hasClaude ? 'Configurado' : 'Não configurado (necessário para Claude Code)'}`);

  // Check language
  const lang = detectLanguageSync(projectPath);
  console.log(`${lang ? chalk.green('✓') : chalk.yellow('⚠')} Linguagem: ${formatLanguage(lang) || 'Não detectada (use --lang=)'}`);

  console.log();
  if (allOk) {
    console.log(chalk.green('✓ Tudo OK! Sistema pronto para uso.\n'));
  } else {
    console.log(chalk.yellow('⚠ Alguns problemas encontrados. Execute: npx audit-system connect\n'));
  }
}
