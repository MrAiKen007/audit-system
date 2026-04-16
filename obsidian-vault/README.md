# Audit System — Knowledge Base

tags: #index #home

---

## Structure

```
obsidian-vault/
├── vulnerabilities/       ← Known vulnerability types with PoC
├── attack-patterns/     ← Abstract attack patterns
├── hypotheses/          ← Active attack hypotheses per audit
├── poc/                 ← Completed proof of concepts
├── test-strategies/     ← Testing methodologies
├── reports/             ← Completed audit reports
├── failed-hypotheses/  ← What didn't work + why
├── invariant-catalog/   ← DeFi invariants that can be violated
├── novel-patterns/      ← Novel discovery frameworks
└── research/            ← Research materials
    ├── emerging-threats/    ← New attack research
    ├── protocol-specific/     ← Protocol-specific knowledge
    └── cross-protocol-analysis/ ← Multi-protocol studies
```

---

## Vulnerability Index

| Vulnerability | Severity | Notes |
|---|---|---|
| [[vulnerabilities/reentrancy]] | CRITICAL | CEI pattern |
| [[vulnerabilities/access-control]] | CRITICAL/HIGH | Modifiers |
| [[vulnerabilities/oracle-manipulation]] | CRITICAL | TWAP |
| [[vulnerabilities/flash-loan-attack]] | CRITICAL | Atomicity |

---

## Attack Patterns

- [[attack-patterns/state-inconsistency]] — Root cause of many bugs
- [[attack-patterns/privilege-escalation]] — Access control bypass
- [[attack-patterns/price-manipulation]] — Oracle attacks

---

## Novel Discovery Resources

- [[invariant-catalog/defi-invariants]] — Common invariants to test
- [[novel-patterns/pattern-mutation-framework]] — Mutate patterns for novel attacks
- [[failed-hypotheses/_template]] — Learn from failed attempts

---

## Test Strategies

- [[test-strategies/fuzzing]] — Automated random testing
- [[test-strategies/invariant-testing]] — Property-based testing

---

## Workflow

### Standard Audit
```
New Audit
    ↓
Create hypothesis in hypotheses/
    ↓
Cross-reference vulnerabilities/
    ↓
Build PoC in Foundry
    ↓
Save result (confirmed → poc/, refuted → failed-hypotheses/)
    ↓
Write report entry in reports/
```

### Novel Discovery Audit
```
Standard Audit Pass
    ↓
Apply novel discovery (see skills/novel-discovery.md)
    ↓
Map assumptions → Break assumptions → Economic model
    ↓
State machine analysis → Composition attacks
    ↓
Generate novel hypotheses
    ↓
Test and document in hypotheses/
```

---

## Skills Reference

| Skill | Purpose |
|---|---|
| [[../skills/auditor]] | Full contract analysis |
| [[../skills/exploit-generator]] | PoC creation |
| [[../skills/test-generator]] | Test suite generation |
| [[../skills/novel-discovery]] | Novel vulnerability discovery |
