#!/usr/bin/env node

import chalk from 'chalk';
import minimist from 'minimist';
import { install, showStatus, listAgents, doctor } from './lib/install.js';

const argv = minimist(process.argv.slice(2), {
  alias: {
    lang: 'l',
    help: 'h',
    path: 'p',
  },
  string: ['lang', 'path'],
  boolean: ['help'],
});

const command = argv._[0] || 'help';

async function main() {
  switch (command) {
    case 'connect':
    case 'init':
    case 'install': {
      const lang = argv.lang || null;
      const projectPath = argv.path || process.cwd();
      await install({ lang, projectPath });
      break;
    }

    case 'status':
    case 'check': {
      await showStatus({ projectPath: argv.path || process.cwd() });
      break;
    }

    case 'agents':
    case 'list': {
      await listAgents();
      break;
    }

    case 'doctor':
    case 'diagnose': {
      await doctor({ projectPath: argv.path || process.cwd() });
      break;
    }

    case 'lang':
    case 'language': {
      const { detectLanguageSync, formatLanguage } = await import('./lib/detect-lang.js');
      const lang = detectLanguageSync(argv.path || process.cwd());
      console.log(chalk.white(`🌐 Linguagem detectada: ${formatLanguage(lang) || 'Nenhuma'}`));
      break;
    }

    case 'help':
    case '--help':
    default: {
      showHelp();
      break;
    }
  }
}

function showHelp() {
  console.log(chalk.blue.bold('\nAudit System — Multi-agent Smart Contract Auditor\n'));
  console.log(chalk.white('Uso: npx audit-system <comando> [opções]\n'));
  console.log(chalk.white('Comandos:'));
  console.log(chalk.cyan('  connect, init   Instala/configura o audit-system no projeto atual'));
  console.log(chalk.cyan('  status, check   Mostra status da instalação'));
  console.log(chalk.cyan('  agents, list    Lista agentes disponíveis'));
  console.log(chalk.cyan('  doctor, diagnose Verifica saúde da instalação'));
  console.log(chalk.cyan('  lang, language  Detecta linguagem do projeto'));
  console.log(chalk.cyan('  help            Mostra esta mensagem\n'));
  console.log(chalk.white('Opções:'));
  console.log(chalk.cyan('  --lang, -l   Força linguagem (solidity | rust)'));
  console.log(chalk.cyan('  --path, -p   Caminho do projeto (padrão: diretório atual)'));
  console.log(chalk.cyan('  --help, -h   Mostra ajuda\n'));
  console.log(chalk.white('Exemplos:'));
  console.log(chalk.gray('  npx audit-system connect'));
  console.log(chalk.gray('  npx audit-system connect --lang=rust'));
  console.log(chalk.gray('  npx audit-system connect --path=~/meu-projeto'));
  console.log(chalk.gray('  npx audit-system status'));
  console.log(chalk.gray('  npx audit-system lang'));
  console.log(chalk.gray('  npx audit-system doctor\n'));
  console.log(chalk.white('Após instalar, abra o Claude Code e digite:'));
  console.log(chalk.green('  /audit-connect\n'));
}

main().catch((err) => {
  console.error(chalk.red('\nErro:'), err.message);
  process.exit(1);
});
