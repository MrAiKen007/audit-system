import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PACKAGE_ROOT = path.resolve(__dirname, '..');

export function getPackagePath() {
  return PACKAGE_ROOT;
}

export function getProjectPath() {
  return process.cwd();
}

export function getAuditSystemDir(projectPath) {
  return path.join(projectPath, '.audit-system');
}

export function getClaudeDir(projectPath) {
  return path.join(projectPath, '.claude');
}

export async function copyDir(src, dest) {
  await fs.ensureDir(dest);
  await fs.copy(src, dest, {
    filter: (srcPath) => {
      const basename = path.basename(srcPath);
      return basename !== 'node_modules';
    }
  });
}

export async function writeJson(filePath, obj) {
  await fs.writeFile(filePath, JSON.stringify(obj, null, 2) + '\n');
}

export function resolvePath(...segments) {
  return path.resolve(...segments);
}
