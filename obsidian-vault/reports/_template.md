# Audit Report: [Protocol Name]

tags: #report #audit

---

## Executive Summary
**Protocol:** [Name]  
**Date:** [Date]  
**Auditor:** [Name]  
**Scope:** [Files audited]  
**Total Findings:** CRITICAL: X | HIGH: X | MEDIUM: X | LOW: X | INFO: X

---

## Findings Summary

| ID | Severity | Title | Status |
|---|---|---|---|
| C-01 | CRITICAL | [Title] | Open |
| H-01 | HIGH | [Title] | Open |
| M-01 | MEDIUM | [Title] | Open |

---

## Detailed Findings

### [C-01] CRITICAL — [Title]

**Location:** `Contract.sol` :: `functionName()` :: line N

**Description:**  
[Clear explanation of the vulnerability]

**Root Cause:**  
[Technical reason why this exists]

**Impact:**  
[What an attacker can achieve and economic damage]

**Attack Vector:**
```
1. Attacker calls X with Y
2. Contract state becomes inconsistent
3. Attacker calls Z to extract funds
4. Loss: [amount]
```

**PoC (Foundry):**
```solidity
function test_C01_exploit() public {
    // setup
    
    // attack
    
    // assert
    assertGt(attacker.balance, 0);
}
```

**Recommendation:**
```solidity
// Fixed version
function fixedFunction() external nonReentrant {
    // CEI pattern
    uint256 amount = balances[msg.sender];
    balances[msg.sender] = 0;  // Effect first
    payable(msg.sender).call{value: amount}("");  // Then interact
}
```

---

## Appendix

### Methodology
1. Manual code review
2. Static analysis (Slither)
3. Fuzz testing (Foundry)
4. Invariant testing
5. PoC development

### Tools Used
- Foundry
- Slither  
- Echidna

---

## Links
- [[vulnerabilities/]]
- [[poc/]]
