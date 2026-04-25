# Hypothesis Template: Governance Protocol

## Protocol Context
- **Type:** DAO / Governance / Voting System
- **Key Components:** Proposal creation, voting mechanisms, timelocks, execution
- **Critical Invariants:** One token = one vote, quorum requirements, execution delay

---

## Assumption Mapping

### Developer Assumptions About Voting Power
```
ASSUMPTION: Voting power accurately represents stakeholder interest
REALITY: Voting power can be borrowed or manipulated
HYPOTHESIS: Flash loan voting allows proposal capture

ASSUMPTION: Voters are long-term stakeholders
REALITY: Governance tokens can be traded or borrowed
HYPOTHESIS: Short-term actors can capture long-term decisions
```

### Developer Assumptions About Proposal Process
```
ASSUMPTION: Proposals are submitted in good faith
REALITY: Proposals can be malicious or exploitative
HYPOTHESIS: Malicious proposal can drain treasury

ASSUMPTION: Timelock provides adequate review time
REALITY: Timelock can be bypassed or rushed
HYPOTHESIS: Emergency mechanisms bypass timelock
```

### Developer Assumptions About Execution
```
ASSUMPTION: Proposal execution is atomic and safe
REALITY: Execution may have reentrancy or ordering issues
HYPOTHESIS: Execution can be manipulated mid-flight
```

---

## Attack Vectors Specific to Governance

### 1. Flash Loan Governance Attack
```solidity
HYPOTHESIS ID: H-GOV-001
ASSUMPTION BROKEN: "Voters have long-term alignment with protocol"
VIOLATION METHOD: Borrow voting power, pass malicious proposal, repay
PRECONDITIONS:
  - Voting power based on token balance at snapshot
  - No minimum lockup or delegation period
  - Proposal threshold achievable with flash loan
ATTACK SEQUENCE:
  1. Flash loan massive amount of governance tokens
  2. Delegate voting power to attacker address
  3. Create and vote on malicious proposal (e.g., "send treasury to attacker")
  4. Proposal passes with borrowed voting power
  5. Execute after timelock (or if no timelock)
  6. Repay flash loan (if same-block execution possible)
  OR wait for timelock with rented tokens
SUCCESS CONDITION: Malicious proposal passes and executes
ESTIMATED IMPACT: Treasury drain, protocol capture
NOVELTY: Governance-specific flash attack
```

### 2. Proposal Front-Running
```solidity
HYPOTHESIS ID: H-GOV-002
ASSUMPTION BROKEN: "Proposal order does not affect outcomes"
REALITY: Competing proposals can pre-empt legitimate ones
PRECONDITIONS:
  - Multiple proposals can coexist
  - First proposal to reach quorum executes
ATTACK SEQUENCE:
  1. Monitor mempool for legitimate proposal
  2. Front-run with competing proposal (similar but malicious)
  3. Use flash loan or pre-positioned tokens to vote first
  4. Legitimate proposal becomes irrelevant
SUCCESS CONDITION: Attacker proposal executes instead of legitimate one
ESTIMATED IMPACT: Governance capture, user funds at risk
NOVELTY: Proposal-level MEV
```

### 3. Vote Manipulation Through Token Economics
```solidity
HYPOTHESIS ID: H-GOV-003
ASSUMPTION BROKEN: "Token distribution reflects governance power fairly"
REALITY: Token concentration allows capture
PRECONDITIONS:
  - Top holders control majority of votes
  - No quadratic voting or caps
ATTACK SEQUENCE:
  1. Accumulate or borrow majority of tokens
  2. Delegate to single address
  3. Pass any proposal regardless of community interest
  4. Or: Hold community hostage for ransom
SUCCESS CONDITION: Attacker controls all governance outcomes
ESTIMATED IMPACT: Governance centralization, community disempowerment
NOVELTY: Economic capture of decentralized governance
```

### 4. Timelock Bypass Through Emergency Mechanisms
```solidity
HYPOTHESIS ID: H-GOV-004
ASSUMPTION BROKEN: "Timelock cannot be bypassed"
REALITY: Emergency functions may override timelock
PRECONDITIONS:
  - Emergency pause or guardian exists
  - Guardian has elevated privileges
ATTACK SEQUENCE:
  1. Compromise or coerce guardian (economic attack, social engineering)
  2. Use emergency function to bypass timelock
  3. Execute malicious action immediately
  4. Disable governance response
SUCCESS CONDITION: Action executed without timelock delay
ESTIMATED IMPACT: Immediate protocol capture
NOVELTY: Privilege escalation through emergency mechanism
```

### 5. Quorum Manipulation
```solidity
HYPOTHESIS ID: H-GOV-005
ASSUMPTION BROKEN: "Quorum requirement ensures broad participation"
REALITY: Quorum can be manipulated through token economics
PRECONDITIONS:
  - Quorum based on outstanding tokens, not active voters
  - Many tokens are inactive or lost
ATTACK SEQUENCE:
  1. Identify inactive token holders (lost keys, dead addresses)
  2. Calculate effective quorum (much lower than nominal)
  3. Accumulate just enough active tokens to reach effective quorum
  4. Pass proposals with tiny fraction of total supply
SUCCESS CONDITION: Proposal passes with minimal support
ESTIMATED IMPACT: Minority capture of protocol
NOVELTY: Quorum calculation exploit
```

### 6. Proposal Griefing / Censorship
```solidity
HYPOTHESIS ID: H-GOV-006
ASSUMPTION BROKEN: "Legitimate proposals can always be submitted"
REALITY: Proposal process can be griefed
PRECONDITIONS:
  - Proposal requires deposit or fee
  - No protection against censorship
ATTACK SEQUENCE:
  1. Monitor for proposals you oppose
  2. Outvote or censor before they reach quorum
  3. Or: Flood governance with spam proposals
  4. Legitimate proposals cannot get attention or quorum
SUCCESS CONDITION: Governance gridlock, attacker preferences enforced
ESTIMATED IMPACT: Governance paralysis
NOVELTY: Denial of service on governance
```

### 7. Execution Reentrancy
```solidity
HYPOTHESIS ID: H-GOV-007
ASSUMPTION BROKEN: "Proposal execution is reentrancy-safe"
REALITY: External calls during execution can be exploited
PRECONDITIONS:
  - Proposal execution makes external calls
  - State updated after external call
ATTACK SEQUENCE:
  1. Create proposal that calls malicious contract
  2. During execution, reenter governance contract
  3. Modify proposal state or execute again
  4. Extract value or double-execute
SUCCESS CONDITION: Proposal executes multiple times or state corrupted
ESTIMATED IMPACT: Fund loss, governance state corruption
NOVELTY: Reentrancy in governance execution
```

---

## Invariants to Test

```solidity
// INVARIANT 1: Voting power = token balance (or delegated amount)
assert(votingPower[user] == tokenBalance[user] + delegatedIn[user] - delegatedOut[user]);

// INVARIANT 2: Proposal executed exactly once
assert(!proposalExecuted[id] || proposal[id].executed);

// INVARIANT 3: Timelock enforced
assert(block.timestamp >= proposal[id].executionTime);

// INVARIANT 4: Quorum properly calculated
assert(quorumReached[id] == (votesFor[id] + votesAgainst[id] + votesAbstain[id]) >= quorum);

// INVARIANT 5: No double voting
for each user: assert(voted[user][proposalId] == false || voteWeight[user] counted once);
```

---

## Foundry Test Skeleton

```solidity
contract GovernanceHypothesisTest is Test {
    IGovernance gov;
    IERC20 govToken;
    ITimelock timelock;
    ITreasury treasury;

    function test_flashLoanGovernanceAttack() public {
        // Setup: Flash loan provider, governance tokens available
        // Attack: Borrow, vote, pass malicious proposal, execute, repay
        // Assert: Treasury drained or protocol captured
    }

    function test_proposalFrontRunning() public {
        // Setup: Legitimate proposal pending
        // Attack: Front-run with competing proposal
        // Assert: Attacker proposal wins
    }

    function test_timelockBypass() public {
        // Setup: Emergency guardian exists
        // Attack: Compromise guardian, bypass timelock
        // Assert: Action executed immediately
    }

    function test_quorumManipulation() public {
        // Setup: Identify inactive token supply
        // Attack: Accumulate just enough for effective quorum
        // Assert: Proposal passes with minimal support
    }

    function test_executionReentrancy() public {
        // Setup: Malicious proposal target
        // Attack: Reenter during execution
        // Assert: Double execution or state corruption
    }
}
```

---

## Related Vulnerabilities
- [[../vulnerabilities/reentrancy]]
- [[../vulnerabilities/access-control]]
- [[../vulnerabilities/oracle-manipulation]]

---

## Real-World Governance Exploits (Reference)
| Protocol | Year | Loss | Vector |
|----------|------|------|--------|
| Beanstalk | 2022 | $180M | Flash loan governance (majority vote capture) |
| DAO (Classic) | 2016 | $60M | Reentrancy during execution |
| Various DAOs | 2023+ | Multiple | Governance token concentration |

---

## Validation Checklist
- [ ] Hypothesis exploits governance-specific mechanics
- [ ] Considers flash loan capabilities
- [ ] Tests timelock and emergency bypasses
- [ ] Accounts for voting power manipulation
- [ ] Checks proposal lifecycle thoroughly
- [ ] Considers economic and social attack vectors
