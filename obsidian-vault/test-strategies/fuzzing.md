# Fuzzing Strategy

tags: #strategy #testing #fuzzing

---

## Overview
Fuzzing automatically tests functions with random inputs to find edge cases and unexpected behavior. In Foundry, it runs hundreds/thousands of times per test.

---

## When to Fuzz

Use fuzz tests when:
- Function accepts numerical inputs
- Function has complex branching logic
- You want to find edge cases you can't imagine
- Testing invariants across many states

---

## Foundry Fuzz Config (foundry.toml)

```toml
[fuzz]
runs = 10000        # More runs = better coverage
max_test_rejects = 65536
seed = 0x1234

[invariant]
runs = 500
depth = 50          # Calls per run
```

---

## Fuzz Target Priority

### Highest Value Targets
1. `withdraw()` / `claim()` — any function moving funds
2. `swap()` — exchange functions
3. `liquidate()` — liquidation logic
4. `borrow()` — lending logic
5. `mint()` / `burn()` — supply modification

---

## Bounding Inputs

```solidity
// Always bound to prevent wasted runs
amount = bound(amount, 1, type(uint128).max);
user = address(uint160(bound(uint256(user), 1, type(uint160).max)));
```

---

## Echidna Integration

```yaml
# echidna.yaml
testLimit: 50000
seqLen: 100
shrinkLimit: 5000
filterFunctions: ["setUp"]

# Run:
# echidna . --contract FuzzTarget --config echidna.yaml
```

---

## Links
- [[skills/test-generator]]
- [[vulnerabilities/reentrancy]]
