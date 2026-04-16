# State Inconsistency Pattern

tags: #pattern #state #reentrancy #critical

---

## Description
State becomes inconsistent when multiple variables must be updated atomically but aren't. This is the root cause behind reentrancy, cross-function attacks, and many logic bugs.

---

## Hypothesis Framework

```
Given: Variable A and Variable B must always satisfy: A == f(B)

Attack vector:
1. Read A (stale value)
2. External interaction happens
3. B is updated
4. A is NOT updated
5. Invariant A == f(B) broken
```

---

## Common Manifestations

### Reentrancy Root Cause
```
balance[user] → not zeroed before external call
External call → re-enters → reads stale balance
Withdraws again using stale balance
```

### Cross-Function State Bug
```
Function A: sets state = PROCESSING
External call in A
Function B: checks state == IDLE (stale) and executes
State becomes inconsistent
```

### Snapshot Manipulation
```
Snapshot taken at block N
Attacker front-runs to inflate balance
Snapshot shows inflated balance
Attacker claims reward/vote based on fake snapshot
```

---

## Detection Questions

```
1. Are there multiple state variables that must be updated together?
2. Is there any external call between reads and writes?
3. Can state be read between partial updates?
4. Is there a time gap where state is inconsistent?
```

---

## Test Strategy

```solidity
function test_stateConsistency() public {
    // Record state at point A
    uint256 stateA = target.variableA();
    uint256 stateB = target.variableB();

    // Verify invariant holds before
    assertTrue(checkInvariant(stateA, stateB));

    // Perform operation
    target.operation();

    // Verify invariant holds after
    stateA = target.variableA();
    stateB = target.variableB();
    assertTrue(checkInvariant(stateA, stateB));
}
```

---

## Links
- [[vulnerabilities/reentrancy]]
- [[vulnerabilities/access-control]]
