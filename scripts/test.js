#!/usr/bin/env node

import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

console.log(chalk.blue.bold('=== Audit System Plugin Test ===\n'));

async function test() {
  try {
    let testsPassed = 0;
    let totalTests = 0;
    
    // Test 1: Configuration loading
    console.log(chalk.yellow('1. Testing configuration loading...'));
    totalTests++;
    
    try {
      const configPath = path.join(rootDir, 'config.json');
      const config = await fs.readJson(configPath);
      
      if (config.name && config.version && config.default_model) {
        console.log(chalk.green('   Configuration structure - PASS'));
        testsPassed++;
      } else {
        throw new Error('Missing required config fields');
      }
    } catch (error) {
      console.log(chalk.red('   Configuration loading - FAIL:'), error.message);
    }
    
    // Test 2: Plugin manifest
    console.log(chalk.yellow('\n2. Testing plugin manifest...'));
    totalTests++;
    
    try {
      const manifestPath = path.join(rootDir, 'claude-plugin.json');
      const manifest = await fs.readJson(manifestPath);
      
      if (manifest.name && manifest.id && manifest.commands && manifest.capabilities) {
        console.log(chalk.green('   Plugin manifest - PASS'));
        testsPassed++;
      } else {
        throw new Error('Missing required manifest fields');
      }
    } catch (error) {
      console.log(chalk.red('   Plugin manifest - FAIL:'), error.message);
    }
    
    // Test 3: Agents validation
    console.log(chalk.yellow('\n3. Testing agents configuration...'));
    totalTests++;
    
    try {
      const agentsDir = path.join(rootDir, 'agents');
      const agentFiles = await fs.readdir(agentsDir);
      let validAgents = 0;
      
      for (const file of agentFiles) {
        if (file.endsWith('.json')) {
          const agentPath = path.join(agentsDir, file);
          const agent = await fs.readJson(agentPath);
          
          if (agent.name && agent.description && agent.type) {
            validAgents++;
          }
        }
      }
      
      if (validAgents >= 8) {
        console.log(chalk.green(`   Agents validation - PASS (${validAgents}/8)`));
        testsPassed++;
      } else {
        throw new Error(`Only ${validAgents}/8 valid agents found`);
      }
    } catch (error) {
      console.log(chalk.red('   Agents validation - FAIL:'), error.message);
    }
    
    // Test 4: Skills validation
    console.log(chalk.yellow('\n4. Testing skills structure...'));
    totalTests++;
    
    try {
      const skillsDir = path.join(rootDir, 'skills');
      const skillFiles = await fs.readdir(skillsDir);
      let validSkills = 0;
      
      for (const file of skillFiles) {
        if (file.endsWith('.md')) {
          const skillPath = path.join(skillsDir, file);
          const content = await fs.readFile(skillPath, 'utf8');
          
          // Check if it's a valid skill file (has content and structure)
          if (content.length > 100 && (content.includes('#') || content.includes('##'))) {
            validSkills++;
          }
        }
      }
      
      if (validSkills >= 5) {
        console.log(chalk.green(`   Skills validation - PASS (${validSkills}/5)`));
        testsPassed++;
      } else {
        throw new Error(`Only ${validSkills}/5 valid skills found`);
      }
    } catch (error) {
      console.log(chalk.red('   Skills validation - FAIL:'), error.message);
    }
    
    // Test 5: Knowledge base
    console.log(chalk.yellow('\n5. Testing knowledge base structure...'));
    totalTests++;
    
    try {
      const vaultDir = path.join(rootDir, 'obsidian-vault');
      const vaultItems = await fs.readdir(vaultDir);
      
      let expectedDirs = ['vulnerabilities', 'hypotheses', 'invariant-catalog'];
      let foundDirs = 0;
      
      for (const dir of expectedDirs) {
        if (vaultItems.includes(dir)) {
          const dirPath = path.join(vaultDir, dir);
          const isDir = await fs.stat(dirPath).then(s => s.isDirectory()).catch(() => false);
          if (isDir) foundDirs++;
        }
      }
      
      if (foundDirs >= 2) {
        console.log(chalk.green(`   Knowledge base - PASS (${foundDirs}/3 core directories)`));
        testsPassed++;
      } else {
        throw new Error(`Only ${foundDirs}/3 core directories found`);
      }
    } catch (error) {
      console.log(chalk.red('   Knowledge base - FAIL:'), error.message);
    }
    
    // Test 6: Workflow files
    console.log(chalk.yellow('\n6. Testing workflow files...'));
    totalTests++;
    
    try {
      const workflowsDir = path.join(rootDir, '.windsurf', 'workflows');
      const workflowFiles = await fs.readdir(workflowsDir);
      
      if (workflowFiles.includes('audit-connect.md') && workflowFiles.includes('audit-agent.md')) {
        console.log(chalk.green('   Workflow files - PASS'));
        testsPassed++;
      } else {
        throw new Error('Missing workflow files');
      }
    } catch (error) {
      console.log(chalk.red('   Workflow files - FAIL:'), error.message);
    }
    
    // Test 7: Model compatibility
    console.log(chalk.yellow('\n7. Testing model compatibility...'));
    totalTests++;
    
    try {
      const configPath = path.join(rootDir, 'config.json');
      const config = await fs.readJson(configPath);
      
      if (config.supported_models && Array.isArray(config.supported_models) && config.supported_models.length > 0) {
        console.log(chalk.green(`   Model compatibility - PASS (${config.supported_models.length} models)`));
        testsPassed++;
      } else {
        throw new Error('No supported models defined');
      }
    } catch (error) {
      console.log(chalk.red('   Model compatibility - FAIL:'), error.message);
    }
    
    // Results
    console.log(chalk.blue.bold(`\n=== Test Results: ${testsPassed}/${totalTests} ===`));
    
    if (testsPassed === totalTests) {
      console.log(chalk.green.bold('All tests PASSED! Plugin is ready for deployment.'));
      console.log(chalk.cyan('\nDeployment checklist:'));
      console.log(chalk.cyan('1. Update repository URL in package.json'));
      console.log(chalk.cyan('2. Update repository URL in claude-plugin.json'));
      console.log(chalk.cyan('3. Commit and push to GitHub'));
      console.log(chalk.cyan('4. Create a GitHub release'));
      console.log(chalk.cyan('5. Submit to Claude plugin marketplace (if applicable)'));
    } else {
      console.log(chalk.red.bold('Some tests FAILED. Fix issues before deployment.'));
      process.exit(1);
    }
    
  } catch (error) {
    console.error(chalk.red('\nTest suite failed:'), error.message);
    process.exit(1);
  }
}

test();
