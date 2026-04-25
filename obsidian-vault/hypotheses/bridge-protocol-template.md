# Hypothesis Template: Bridge Protocol

## Protocol Context
- **Type:** Cross-Chain Bridge / Token Wrapper / Message Relay
- **Key Components:** Lock/mint mechanism, validators/oracles, message passing, replay protection
- **Critical Invariants:** Wrapped supply = locked amount, message uniqueness, validator consensus

---

## Assumption Mapping

### Developer Assumptions About Validators
```
ASSUMPTION: Validators are honest and independent
REALITY: Validators can be compromised or collude
HYPOTHESIS: Threshold signature scheme can be attacked

ASSUMPTION: Validator set is secure
REALITY: Validator addition/removal may have bugs
HYPOTHESIS: Attacker can add controlled validator
```

### Developer Assumptions About Messages
```
ASSUMPTION: Each message is unique and non-replayable
REALITY: Replay protection may have edge cases
HYPOTHESIS: Same message can be executed multiple times

ASSUMPTION: Message data cannot be tampered
REALITY: Signature verification may have bugs
HYPOTHESIS: Modify message content while keeping valid signature
```

### Developer Assumptions About Locked Tokens
```
ASSUMPTION: Locked tokens remain secure until redemption
REALITY: Lock mechanism may be bypassed
HYPOTHESIS: Direct transfer or reentrancy bypasses lock

ASSUMPTION: Wrapped supply always matches locked
REALITY: Minting may not be properly backed
HYPOTHESIS: Mint unwrapped tokens without locking
```

---

## Attack Vectors Specific to Bridges

### 1. Signature Malleability / Replay Attack
```solidity
HYPOTHESIS ID: H-BRIDGE-001
ASSUMPTION BROKEN: "Each bridge message can only be executed once"
VIOLATION METHOD: Replay valid signature on different chain or with modified data
PRECONDITIONS:
  - Replay protection uses simple nonce or hash
  - Chain ID not included in signature
  - Signature scheme allows malleability (ECDSA s-value)
ATTACK SEQUENCE:
  1. Observe valid bridge transaction
  2. Modify signature (malleability) or reuse with different parameters
  3. Execute same transfer again
  4. Or: Execute on wrong chain if Chain ID not checked
SUCCESS CONDITION: Same deposit redeemed multiple times
ESTIMATED IMPACT: Infinite minting of wrapped tokens
NOVELTY: Signature scheme specific vulnerability
```

### 2. Validator Threshold Attack
```solidity
HYPOTHESIS ID: H-BRIDGE-002
ASSUMPTION BROKEN: "Validator threshold prevents malicious consensus"
REALITY: Attacker can control enough validators
PRECONDITIONS:
  - Threshold < 100% (e.g., 5/9 validators)
  - Validator set can be influenced
ATTACK SEQUENCE:
  1. Gain control of threshold number of validators
     - Sybil attack if validator selection is weak
     - Bribe or compromise existing validators
     - Exploit validator rotation mechanism
  2. Sign fraudulent withdrawal
  3. Drain bridge liquidity
SUCCESS CONDITION: Fraudulent withdrawal approved
ESTIMATED IMPACT: Full bridge drain
NOVELTY: Governance/economic attack on validator set
```

### 3. Lock/Unlock Reentrancy
```solidity
HYPOTHESIS ID: H-BRIDGE-003
ASSUMPTION BROKEN: "Lock mechanism is reentrancy-safe"
REALITY: External calls during lock/unlock can be exploited
PRECONDITIONS:
  - Lock function makes external call (token callback, event)
  - State updated after external call
ATTACK SEQUENCE:
  1. Call bridge lock function
  2. In callback, call lock function again
  3. State not updated, same tokens "locked" twice
  4. Receive double wrapped tokens
  OR:
  1. Initiate withdrawal
  2. Reenter during transfer
  3. Withdraw multiple times before balance updated
SUCCESS CONDITION: Wrapped tokens > locked tokens
ESTIMATED IMPACT: Unbacked wrapped tokens, bridge insolvency
NOVELTY: Bridge-specific reentrancy pattern
```

### 4. Chain ID / Domain Separation Bypass
```solidity
HYPOTHESIS ID: H-BRIDGE-004
ASSUMPTION BROKEN: "Messages are valid only on specific chain"
REALITY: Chain ID not properly checked in signature
PRECONDITIONS:
  - Signature does not include chainId
  - Same validator set across chains
ATTACK SEQUENCE:
  1. Get valid signature from Chain A
  2. Replay exact same signature on Chain B
  3. Validators approve because signature is valid
  4. Double-spend same deposit on multiple chains
SUCCESS CONDITION: Same deposit redeemed on multiple chains
ESTIMATED IMPACT: Multiple wrapped tokens for single deposit
NOVELTY: Cross-chain replay
```

### 5. Price/Value Discrepancy Attack
```solidity
HYPOTHESIS ID: H-BRIDGE-005
ASSUMPTION BROKEN: "Bridge correctly values assets across chains"
REALITY: Different chains may have different price oracles
PRECONDITIONS:
  - Bridge handles multiple assets
  - Value calculation differs across chains
ATTACK SEQUENCE:
  1. Deposit overvalued asset on Chain A
  2. Receive credit based on inflated value
  3. Withdraw undervalued asset on Chain B
  4. Profit from discrepancy
SUCCESS CONDITION: Withdraw value > deposit value
ESTIMATED IMPACT: Gradual bridge drain through arbitrage
NOVELTY: Economic exploitation of price oracle differences
```

### 6. Message Ordering / Front-Running
```solidity
HYPOTHESIS ID: H-BRIDGE-006
ASSUMPTION BROKEN: "Message order does not affect security"
REALITY: Ordering can be exploited for front-running
PRECONDITIONS:
  - Messages processed in received order
  - No commitment scheme
ATTACK SEQUENCE:
  1. Observe large bridge transfer in mempool
  2. Front-run with own transfer
  3. Manipulate state (price, liquidity) before victim
  4. Extract value from price movement
SUCCESS CONDITION: Profit from front-running
ESTIMATED IMPACT: Systematic MEV extraction
NOVELTY: Bridge-specific MEV pattern
```

---

## Invariants to Test

```solidity
// INVARIANT 1: Wrapped supply = locked amount
assert(wrappedToken.totalSupply() == lockedToken.balanceOf(bridge));

// INVARIANT 2: Each message executed exactly once
assert(!executedMessages[messageHash]);

// INVARIANT 3: Validator threshold properly enforced
assert(validSignatures >= threshold);

// INVARIANT 4: Chain ID included in all signatures
// (Test by attempting replay on different chain)

// INVARIANT 5: No reentrancy during lock/unlock
// (Use reentrancy guard or checks-effects-interactions)
```

---

## Foundry Test Skeleton

```solidity
contract BridgeHypothesisTest is Test {
    IBridge bridge;
    IERC20 lockedToken;
    IERC20 wrappedToken;
    address[] validators;

    function test_signatureReplay() public {
        // Setup: Create valid bridge signature
        // Attack: Modify signature or replay on different chain
        // Assert: Same message executed twice
    }

    function test_validatorThresholdAttack() public {
        // Setup: Create malicious validators
        // Attack: Reach threshold with controlled validators
        // Assert: Fraudulent withdrawal approved
    }

    function test_lockReentrancy() public {
        // Setup: Malicious contract as depositor
        // Attack: Reenter during lock callback
        // Assert: Double tokens minted
    }

    function test_chainIdBypass() public {
        // Setup: Signature from Chain A
        // Attack: Replay on Chain B (fork test)
        // Assert: Valid execution on wrong chain
    }

    function test_valueDiscrepancy() public {
        // Setup: Multi-asset bridge with different oracles
        // Attack: Deposit overvalued, withdraw undervalued
        // Assert: Profit from discrepancy
    }
}
```

---

## Related Vulnerabilities
- [[../vulnerabilities/reentrancy]]
- [[../vulnerabilities/oracle-manipulation]]
- [[../vulnerabilities/access-control]]

---

## Real-World Bridge Exploits (Reference)
| Bridge | Year | Loss | Vector |
|--------|------|------|--------|
| Ronin | 2022 | $625M | Validator key compromise (5/9 threshold) |
| Wormhole | 2022 | $325M | Signature verification bypass |
| Nomad | 2022 | $190M | Replay attack (merkle root replay) |
| Harmony | 2022 | $100M | Multi-sig compromise (2/5 threshold) |
| Qubit | 2022 | $80M | Fake deposit proof |

---

## Validation Checklist
- [ ] Hypothesis accounts for cross-chain complexity
- [ ] Considers validator economics
- [ ] Tests signature verification thoroughly
- [ ] Checks replay protection on all chains
- [ ] Verifies wrapped supply matches locked
- [ ] Considers MEV and front-running vectors
