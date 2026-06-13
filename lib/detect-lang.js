import fs from 'fs-extra';
import path from 'path';

export async function detectLanguage(projectPath) {
  const hasSolFiles = await hasFilesWithExtension(projectPath, '.sol');
  const hasAnchorToml = await hasFile(projectPath, 'Anchor.toml');
  const hasCargoToml = await hasFile(projectPath, 'Cargo.toml');
  const hasRsFiles = await hasFilesWithExtension(projectPath, '.rs');
  const hasInk = await checkCargoForInk(projectPath);

  const isSolidity = hasSolFiles;
  const isRust = (hasAnchorToml && hasCargoToml) || hasInk || (hasRsFiles && hasCargoToml);

  if (isSolidity && isRust) return 'both';
  if (isSolidity) return 'solidity';
  if (isRust) {
    if (hasAnchorToml) return 'rust-solana';
    if (hasInk) return 'rust-ink';
    return 'rust';
  }
  return null;
}

export function detectLanguageSync(projectPath) {
  const hasSolFiles = hasFilesWithExtensionSync(projectPath, '.sol');
  const hasAnchorToml = hasFileSync(projectPath, 'Anchor.toml');
  const hasCargoToml = hasFileSync(projectPath, 'Cargo.toml');
  const hasRsFiles = hasFilesWithExtensionSync(projectPath, '.rs');
  const hasInk = checkCargoForInkSync(projectPath);

  const isSolidity = hasSolFiles;
  const isRust = (hasAnchorToml && hasCargoToml) || hasInk || (hasRsFiles && hasCargoToml);

  if (isSolidity && isRust) return 'both';
  if (isSolidity) return 'solidity';
  if (isRust) {
    if (hasAnchorToml) return 'rust-solana';
    if (hasInk) return 'rust-ink';
    return 'rust';
  }
  return null;
}

export function formatLanguage(lang) {
  const labels = {
    'solidity': 'Solidity (EVM)',
    'rust': 'Rust (genérico)',
    'rust-solana': 'Rust (Solana/Anchor)',
    'rust-ink': 'Rust (ink!/Polkadot)',
    'both': 'Solidity + Rust (misto)',
  };
  return labels[lang] || lang || 'Desconhecida';
}

async function hasFile(dir, filename) {
  try {
    await fs.access(path.join(dir, filename));
    return true;
  } catch {
    return false;
  }
}

function hasFileSync(dir, filename) {
  try {
    fs.accessSync(path.join(dir, filename));
    return true;
  } catch {
    return false;
  }
}

async function hasFilesWithExtension(dir, ext) {
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    return entries.some(e => !e.isDirectory() && e.name.endsWith(ext));
  } catch {
    return false;
  }
}

function hasFilesWithExtensionSync(dir, ext) {
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    return entries.some(e => !e.isDirectory() && e.name.endsWith(ext));
  } catch {
    return false;
  }
}

async function checkCargoForInk(projectPath) {
  try {
    const cargoPath = path.join(projectPath, 'Cargo.toml');
    const content = await fs.readFile(cargoPath, 'utf8');
    return content.includes('ink') || content.includes('ink_lang');
  } catch {
    return false;
  }
}

function checkCargoForInkSync(projectPath) {
  try {
    const cargoPath = path.join(projectPath, 'Cargo.toml');
    const content = fs.readFileSync(cargoPath, 'utf8');
    return content.includes('ink') || content.includes('ink_lang');
  } catch {
    return false;
  }
}
