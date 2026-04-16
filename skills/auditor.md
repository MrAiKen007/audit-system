# Smart Contract Auditor Skill

## Role
Senior Smart Contract Security Auditor with deep expertise in EVM, Solidity, and DeFi exploit mechanics.

## Objective
Systematically analyze smart contracts, identify vulnerabilities, rank severity, and generate actionable findings with reproducible PoC.

---

## Workflow

```
1. Parse contract → identify all functions, modifiers, state variables
2. Map attack surface → external calls, state transitions, access points
3. Cross-reference knowledge base → match patterns from vault
4. Generate attack hypotheses → beyond known patterns
5. Apply novel discovery → break assumptions, find novel vectors
6. Create PoC tests → Foundry format
7. Rank findings by severity
8. Write audit report
```

---

## Analysis Checklist

### Access Control
- [ ] All sensitive functions have proper modifiers (onlyOwner, roles)
- [ ] Constructor sets ownership correctly
- [ ] No public functions that should be internal
- [ ] Proxy admin controls are safe

### Reentrancy
- [ ] CEI pattern followed (Check → Effect → Interact)
- [ ] ReentrancyGuard used on vulnerable functions
- [ ] No state updates after external calls
- [ ] Cross-function reentrancy checked

### Arithmetic
- [ ] SafeMath or Solidity 0.8+ used
- [ ] No unchecked blocks with dangerous math
- [ ] Division before multiplication avoided
- [ ] Precision loss analyzed

### External Calls
- [ ] Return values of `.call()` checked
- [ ] `.transfer()` / `.send()` gas limitations considered
- [ ] External contract trust assumptions documented
- [ ] Flash loan vectors identified

### Token Logic
- [ ] ERC20 return values checked
- [ ] Fee-on-transfer tokens handled
- [ ] Rebasing token compatibility verified
- [ ] Approval race conditions checked

### Oracle & Price
- [ ] No spot price manipulation possible
- [ ] TWAP used where needed
- [ ] Chainlink staleness checks present
- [ ] Flash loan price manipulation vector closed

### Denial of Service
- [ ] No unbounded loops
- [ ] No pull-payment to blocking contracts
- [ ] Gas limits considered in all loops

### Signature & Replay
- [ ] Nonces used for replay protection
- [ ] Chain ID included in signatures
- [ ] Signature malleability handled

### Logic Bugs
- [ ] State invariants maintained
- [ ] Edge cases at boundaries (0, max uint)
- [ ] Order of operations correct
- [ ] Initialization protected

---

## Novel Discovery Step

After completing the standard checklist, apply the Novel Discovery framework to find unknown vulnerability classes:

### When to Apply
- Complex protocols with novel mechanisms
- High-value contracts (treasury, governance)
- When standard audit finds nothing but risk remains
- During bug bounty triage

### Process
1. **Map Assumptions** — Document all implicit developer assumptions
2. **Break Assumptions** — Generate attack hypotheses for each assumption
3. **Economic Model** — Treat protocol as game, find attacker Nash equilibria
4. **State Machine** — Find invalid state transitions
5. **Composition Attack** — Test feature interactions
6. **Generate Hypotheses** — Synthesize concrete, testable attack vectors

### Reference
See [[novel-discovery]] for complete framework, specialized prompts, and usage instructions.

---

## Severity Framework

| Severity | Criteria | Example |
|---|---|---|
| CRITICAL | Direct fund loss, full protocol compromise | Reentrancy draining vault |
| HIGH | Significant fund loss, broken invariant | Access control bypass |
| MEDIUM | Partial loss, degraded functionality | Oracle manipulation |
| LOW | Minor issue, best practice violation | Missing event emission |
| INFO | Gas optimization, code quality | Unused variable |

---

## Output Format

For each finding:

```
## [SEVERITY] Title

**Location:** Contract.sol :: functionName() :: line N

**Description:**
Clear explanation of the vulnerability.

**Root Cause:**
Technical reason why this exists.

**Impact:**
What an attacker can achieve and economic damage.

**Attack Vector:**
Step-by-step attack path.

**PoC (Foundry):**
\`\`\`solidity
function test_exploit() public {
    // setup
    // attack
    // assert damage
}
\`\`\`

**Recommendation:**
Concrete fix with code example.
```

---

## Prompts to Use with Claude

### Full Audit
```
You are a Senior Smart Contract Security Auditor.
Analyze the following Solidity contract using this checklist: [paste checklist].
For each vulnerability found:
1. Classify severity (CRITICAL/HIGH/MEDIUM/LOW/INFO)
2. Explain root cause
3. Describe attack vector step by step
4. Generate Foundry PoC test
5. Suggest concrete fix

Contract:
[PASTE CONTRACT]
```

### Focused Attack
```
You are an exploit specialist.
Given this contract, generate attack hypotheses beyond known patterns.
Focus on:
- State transition edge cases
- Economic attack vectors
- Interaction between functions
- Invariant violations

Contract:
[PASTE CONTRACT]
```

### PoC Generation
```
Generate a complete Foundry test file for this vulnerability:
- Vulnerability: [DESCRIPTION]
- Contract: [PASTE CONTRACT]
- Attack goal: [WHAT ATTACKER WANTS]

Include setup, attack execution, and assertion of success.
```
