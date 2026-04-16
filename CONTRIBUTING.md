# Contributing to Audit System

First off, thank you for considering contributing to Audit System! It's people like you that make this tool better for the smart contract security community.

## Code of Conduct

This project and everyone participating in it is governed by our commitment to:
- Be respectful and inclusive
- Welcome newcomers
- Focus on constructive feedback
- Prioritize security and safety

## How Can I Contribute?

### Reporting Bugs

Before creating a bug report, please:
1. Check if the issue already exists
2. Use the latest version
3. Collect relevant information

**Template:**
```markdown
**Description:** Clear description of the bug

**Steps to Reproduce:**
1. Go to '...'
2. Run command '...'
3. See error

**Expected behavior:** What you expected

**Environment:**
- OS: [e.g., Windows 10]
- Node.js version: [e.g., 18.0.0]
- Claude Code version: [e.g., 1.0.0]
- Audit System version: [e.g., 1.0.0]

**Additional context:** Any other information
```

### Suggesting Enhancements

Enhancement suggestions are welcome! Please:
1. Use a clear title
2. Describe the enhancement in detail
3. Explain why this would be useful
4. Consider scope and impact

### Pull Requests

1. Fork the repository
2. Create your branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests (`npm test`)
5. Commit with clear messages
6. Push to your fork
7. Open a Pull Request

## Development Setup

```bash
# Clone your fork
git clone https://github.com/YOUR-USERNAME/audit-system.git
cd audit-system

# Install dependencies
npm install

# Run setup
npm run setup

# Run tests
npm test
```

## Project Structure

```
audit-system/
├── agents/           # Agent definitions
├── skills/           # Analysis skills
├── obsidian-vault/   # Knowledge base
├── scripts/          # Setup scripts
└── .windsurf/        # Claude workflows
```

## Adding New Agents

1. Create `agents/new-agent.json`:
```json
{
  "name": "new-agent",
  "description": "What it does",
  "type": "specialist|implementer|coordinator|documenter",
  "model": "claude-opus-4-6",
  "skills": ["skill1.md"],
  "vault_references": ["vulnerabilities/"],
  "output_format": "markdown",
  "parameters": {
    "target": "./contracts/"
  }
}
```

2. Add corresponding skill in `skills/`
3. Update `config.json` workflows
4. Test thoroughly
5. Document in PR

## Adding New Skills

1. Create `skills/new-skill.md` with frontmatter:
```markdown
---
description: What this skill does
type: skill
commands:
  - command-name
---

# Skill content...
```

2. Reference in relevant agents
3. Test with actual contracts
4. Update documentation

## Style Guidelines

### JavaScript/Node.js
- Use ES modules (`import/export`)
- Follow existing code patterns
- Add comments for complex logic
- Use `const`/`let`, avoid `var`

### Markdown
- Use clear headings
- Include code examples
- Keep formatting consistent
- Update table of contents if needed

### JSON
- Use 2-space indentation
- Include trailing commas only if allowed
- Validate before committing

## Testing

```bash
# Run all tests
npm test

# Test specific component
node scripts/test.js

# Manual testing
cd test-project
/audit-connect
/audit-agent full
```

## Documentation

- Update README.md if adding features
- Update INSTALLATION.md if changing setup
- Update DEPLOYMENT.md if changing release process
- Add inline comments for complex code

## Security

- Never commit sensitive data
- Use environment variables for secrets
- Report security issues privately
- Follow security best practices

## Release Process

1. Update version in `package.json`
2. Update `CHANGELOG.md`
3. Create git tag
4. Push to GitHub
5. Create GitHub release

## Questions?

- Check existing [issues](https://github.com/MrAiKen007/audit-system/issues)
- Join [discussions](https://github.com/MrAiKen007/audit-system/discussions)
- Create a new issue with the `question` label

## Recognition

Contributors will be:
- Listed in README.md
- Mentioned in release notes
- Acknowledged in documentation

Thank you for contributing to smart contract security! 🔒
