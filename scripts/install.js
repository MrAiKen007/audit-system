#!/usr/bin/env node

import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

console.log(chalk.blue.bold('=== Audit System Claude Plugin Installation ===\n'));

async function install() {
  try {
    // 1. Check Node.js version
    console.log(chalk.yellow('1. Checking Node.js version...'));
    const nodeVersion = process.version;
    const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);
    
    if (majorVersion < 16) {
      throw new Error(`Node.js ${nodeVersion} is not supported. Requires Node.js >= 16.0.0`);
    }
    console.log(chalk.green(`   Node.js ${nodeVersion} - OK`));
    
    // 2. Check if dependencies are installed
    console.log(chalk.yellow('\n2. Checking dependencies...'));
    
    try {
      await fs.access(path.join(rootDir, 'node_modules'));
      console.log(chalk.green('   Dependencies already installed - OK'));
    } catch {
      console.log(chalk.yellow('   Dependencies not found. Please run: npm install'));
      console.log(chalk.cyan('   Then run: npm run setup'));
      return;
    }
    
    // 3. Verify plugin structure
    console.log(chalk.yellow('\n3. Verifying plugin structure...'));
    
    const requiredStructure = {
      'config.json': 'file',
      'claude-plugin.json': 'file',
      'package.json': 'file',
      'agents': 'directory',
      'skills': 'directory', 
      'obsidian-vault': 'directory',
      'scripts': 'directory'
    };
    
    for (const [name, type] of Object.entries(requiredStructure)) {
      const itemPath = path.join(rootDir, name);
      const exists = await fs.pathExists(itemPath);
      const isDir = await fs.stat(itemPath).then(s => s.isDirectory()).catch(() => false);
      
      if (!exists) {
        throw new Error(`Missing required ${type}: ${name}`);
      }
      
      if (type === 'directory' && !isDir) {
        throw new Error(`${name} should be a directory`);
      }
      
      if (type === 'file' && isDir) {
        throw new Error(`${name} should be a file`);
      }
      
      console.log(chalk.green(`   ${name} - OK`));
    }
    
    // 4. Verify agents
    console.log(chalk.yellow('\n4. Verifying agents...'));
    
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
    
    let agentCount = 0;
    for (const agent of requiredAgents) {
      if (agentFiles.includes(agent)) {
        agentCount++;
        console.log(chalk.green(`   ${agent} - OK`));
      } else {
        console.log(chalk.red(`   ${agent} - MISSING`));
      }
    }
    
    if (agentCount < requiredAgents.length) {
      throw new Error(`Only ${agentCount}/${requiredAgents.length} agents found`);
    }
    
    // 5. Verify skills
    console.log(chalk.yellow('\n5. Verifying skills...'));
    
    const skillsDir = path.join(rootDir, 'skills');
    const skillFiles = await fs.readdir(skillsDir);
    
    const requiredSkills = [
      'audit-connect.md',
      'auditor.md',
      'novel-discovery.md',
      'exploit-generator.md',
      'test-generator.md'
    ];
    
    let skillCount = 0;
    for (const skill of requiredSkills) {
      if (skillFiles.includes(skill)) {
        skillCount++;
        console.log(chalk.green(`   ${skill} - OK`));
      } else {
        console.log(chalk.red(`   ${skill} - MISSING`));
      }
    }
    
    if (skillCount < requiredSkills.length) {
      throw new Error(`Only ${skillCount}/${requiredSkills.length} skills found`);
    }
    
    // 6. Verify knowledge base
    console.log(chalk.yellow('\n6. Verifying knowledge base...'));
    
    const vaultDir = path.join(rootDir, 'obsidian-vault');
    const vaultItems = await fs.readdir(vaultDir);
    
    let vaultCount = 0;
    for (const item of vaultItems) {
      const itemPath = path.join(vaultDir, item);
      const isDir = await fs.stat(itemPath).then(s => s.isDirectory()).catch(() => false);
      if (isDir || item.endsWith('.md')) {
        vaultCount++;
      }
    }
    
    console.log(chalk.green(`   ${vaultCount} knowledge base items - OK`));
    
    // 7. Create installation record
    console.log(chalk.yellow('\n7. Creating installation record...'));
    
    const installRecord = {
      version: '1.0.0',
      installed_at: new Date().toISOString(),
      node_version: nodeVersion,
      platform: process.platform,
      agents_count: agentCount,
      skills_count: skillCount,
      vault_items: vaultCount
    };
    
    await fs.writeFile(
      path.join(rootDir, '.installation-record.json'),
      JSON.stringify(installRecord, null, 2)
    );
    
    console.log(chalk.green('\n=== Installation Complete! ==='));
    console.log(chalk.white('\nAudit System Claude Plugin has been successfully installed.'));
    console.log(chalk.cyan('\nPlugin Summary:'));
    console.log(chalk.cyan(`- ${agentCount} specialized agents`));
    console.log(chalk.cyan(`- ${skillCount} analysis skills`));
    console.log(chalk.cyan(`- ${vaultCount} knowledge base items`));
    console.log(chalk.cyan(`- Compatible with multiple AI models`));
    
    console.log(chalk.cyan('\nNext steps:'));
    console.log(chalk.cyan('1. Run: npm run setup'));
    console.log(chalk.cyan('2. Navigate to your project directory'));
    console.log(chalk.cyan('3. Run: /audit-connect'));
    console.log(chalk.cyan('4. Start auditing: /audit-agent full'));
    
  } catch (error) {
    console.error(chalk.red('\nInstallation failed:'), error.message);
    process.exit(1);
  }
}

install();
