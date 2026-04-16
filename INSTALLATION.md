# Installation Guide for Claude Code Plugin

## System Requirements

- **Node.js**: >= 16.0.0
- **Claude Code**: >= 1.0.0
- **Operating System**: Windows, macOS, Linux
- **Memory**: 4GB+ RAM recommended
- **Storage**: 500MB+ available space

## Installation Methods

### Method 1: GitHub Clone (Recommended)

```bash
# 1. Clone the repository
git clone https://github.com/MrAiKen007/audit-system.git
cd audit-system

# 2. Install dependencies
npm install

# 3. Setup the plugin
npm run setup

# 4. Verify installation
npm test
```

### Method 2: Direct Download

1. Download the latest release from [GitHub Releases](https://github.com/MrAiKen007/audit-system/releases)
2. Extract the archive
3. Open terminal in the extracted directory
4. Run: `npm install && npm run setup && npm test`

### Method 3: NPM Package (Future)

```bash
npm install -g audit-system-claude-plugin
audit-system-setup
```

## Post-Installation Setup

### 1. Verify Plugin Structure

After installation, you should have:

```
audit-system/
|-- package.json              # Plugin metadata
|-- claude-plugin.json         # Claude plugin manifest
|-- config.json               # System configuration
|-- agents/                   # 8 agent definitions
|-- skills/                   # 5 analysis skills
|-- obsidian-vault/           # Knowledge base
|-- scripts/                  # Setup scripts
|-- .windsurf/workflows/      # Claude workflows
```

### 2. Test Plugin Functionality

```bash
# Run comprehensive tests
npm test

# Expected output: All tests PASSED! Plugin is ready for deployment.
```

### 3. Configure Claude Code

The plugin automatically configures Claude Code workflows. No manual configuration needed.

## Usage in Claude Code

### First Time Setup

1. **Open Claude Code**
2. **Navigate to your project**:
   ```bash
   cd /path/to/your/smart-contract-project
   ```
3. **Connect audit system**:
   ```
   /audit-connect
   ```
4. **Verify connection**:
   ```
   /audit-status
   ```

### Basic Usage

```bash
# Quick security check
/audit-agent quick

# Full comprehensive audit
/audit-agent full

# Target specific contracts
/audit-agent full --target=./contracts/
```

## Configuration Options

### Model Selection

```bash
# Auto-detect (default)
/audit-connect

# Specify model
/audit-connect --model=claude-opus-4-6
/audit-connect --model=kimi-k2.5
/audit-connect --model=gpt-4o
```

### Output Directory

```bash
# Default: ./audit-output/
/audit-connect --output="./security-audit/"

# Custom path
/audit-connect --output="/path/to/results/"
```

### Audit Modes

```bash
# Full audit (default)
/audit-connect --mode=full

# Novel discovery only
/audit-connect --mode=novel

# Quick assessment
/audit-connect --mode=quick
```

## Troubleshooting

### Installation Issues

**Node.js Version Error**
```bash
# Check Node.js version
node --version

# Update Node.js (if needed)
nvm install 18
nvm use 18
```

**Permission Errors (Linux/macOS)**
```bash
# Fix permissions
sudo chown -R $USER:$USER audit-system/
chmod +x scripts/*.js
```

**Network Issues**
```bash
# Use npm registry mirror
npm config set registry https://registry.npmjs.org/
npm install --registry https://registry.npmjs.org/
```

### Runtime Issues

**Command Not Found**
```bash
# Verify plugin installation
ls -la audit-system/.windsurf/workflows/

# Re-run setup
npm run setup
```

**Agent Loading Failed**
```bash
# Check agent files
ls audit-system/agents/

# Validate JSON syntax
node -e "console.log(JSON.parse(require('fs').readFileSync('audit-system/agents/orchestrator.json')))"
```

**Knowledge Base Access**
```bash
# Verify vault structure
ls audit-system/obsidian-vault/

# Check permissions
ls -la audit-system/obsidian-vault/
```

### Performance Issues

**Memory Usage**
- Close unnecessary applications
- Use `--mode=quick` for faster analysis
- Limit target directory size

**Slow Analysis**
- Use more capable model (`--model=claude-opus-4-6`)
- Reduce target scope with `--target` parameter
- Consider `--mode=novel` for focused analysis

## Verification Commands

### Plugin Health Check

```bash
# 1. Verify installation
npm test

# 2. Check configuration
cat audit-system/config.json

# 3. List available agents
/audit-agents

# 4. Test connection
/audit-status
```

### Sample Test Run

```bash
# Create test contract
mkdir test-project
cd test-project
echo 'contract Test { function vulnerable() public { } }' > Test.sol

# Run quick audit
/audit-connect --mode=quick
/audit-agent quick --target=./Test.sol

# Check results
ls ./audit-output/
```

## Updating the Plugin

### Method 1: Git Pull

```bash
cd audit-system
git pull origin main
npm run setup
npm test
```

### Method 2: Fresh Install

```bash
# Backup custom configurations
cp audit-system/config.json config-backup.json

# Reinstall
rm -rf audit-system
git clone https://github.com/MrAiKen007/audit-system.git
cd audit-system
npm install
npm run setup

# Restore configuration (if needed)
cp config-backup.json audit-system/config.json
```

## Uninstallation

```bash
# Remove plugin directory
rm -rf audit-system

# Clear npm cache (optional)
npm cache clean --force

# Remove Claude Code workflows (manual)
rm -rf ~/.claude/plugins/audit-system*
```

## Support Resources

### Documentation
- [Main README](GITHUB-PLUGIN-README.md)
- [Architecture Guide](ARCHITECTURE.md)
- [Agent Configuration](agents/README.md)

### Community
- [GitHub Issues](https://github.com/MrAiKen007/audit-system/issues)
- [GitHub Discussions](https://github.com/MrAiKen007/audit-system/discussions)
- [Discord Community](https://discord.gg/audit-system)

### Troubleshooting Checklist

- [ ] Node.js version >= 16.0.0
- [ ] Claude Code installed and updated
- [ ] Plugin files downloaded completely
- [ ] npm dependencies installed successfully
- [ ] Setup script completed without errors
- [ ] All tests pass (`npm test`)
- [ ] Workflows created in `.windsurf/workflows/`
- [ ] Commands available in Claude Code

---

**Need help?** Open an issue on GitHub or join our Discord community.
