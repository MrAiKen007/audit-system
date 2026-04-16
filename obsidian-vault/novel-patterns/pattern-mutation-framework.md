# Pattern Mutation Framework

tags: #novel-patterns #mutation #creativity #framework

---

## Overview
Novel vulnerabilities often emerge from combining or mutating known patterns. This framework provides systematic approaches to discover new attack vectors through pattern transformation.

---

## Mutation Strategy 1: Feature Composition

### Concept
Combine two existing features to create an emergent vulnerability.

### Method
```
1. List all features: F1, F2, F3, ..., Fn
2. For each pair (Fi, Fj):
   - Can Fi's output become Fj's input unexpectedly?
   - Does Fi change state that Fj depends on?
   - Can Fi front-run or back-run Fj?
3. Test promising combinations
```

### Example: Flash Loan + Governance
```
Flash Loan (Feature A):
  → Provides large capital temporarily
  → Must be repaid in same transaction

Governance (Feature B):
  → Requires token threshold to propose
  → Voting power proportional to holdings

Composition Attack:
  1. Flash loan governance token
  2. Submit malicious proposal
  3. Vote with flash-loaned power
  4. Repay flash loan
  5. Proposal executes after timelock
  
Result: Governance manipulation without holding tokens
```

### Composition Matrix
| Feature A | Feature B | Potential Attack |
|-----------|-----------|------------------|
| Flash Loan | Price Oracle | Price manipulation |
| Flash Loan | Reward Distribution | Reward harvesting |
| Reentrancy | Upgradeable | Self-destruct proxy |
| Staking | Transfer | Double voting power |
| Time Lock | Emergency Pause | Race condition |

---

## Mutation Strategy 2: Context Shifting

### Concept
Take a pattern that exists in one context and apply it to a different context.

### Method
```
1. Identify known vulnerability pattern P
2. Identify contexts where P is NOT expected: C1, C2, C3
3. Ask: "Could P work in context Cn?"
4. Test the shifted pattern
```

### Context Shift Examples

#### Reentrancy in View Functions (Read-Only Reentrancy)
```
Original Context: State-changing functions
Shifted Context: View functions
Novel Attack: Manipulate state → call view → state still stale → profit
```

#### Integer Overflow in Governance
```
Original Context: ERC20 balances
Shifted Context: Vote counting
Novel Attack: Overflow vote counts to manipulate proposals
```

#### Access Control in Callbacks
```
Original Context: Admin functions
Shifted Context: Token callbacks (ERC777, ERC721)
Novel Attack: Unauthorized actions via callback hooks
```

---

## Mutation Strategy 3: Parameter Manipulation

### Concept
Vary the parameters of a known attack to find new vectors.

### Method
```
For each attack parameter:
- What if it's zero?
- What if it's maximum (type(uint256).max)?
- What if it's boundary value (1, -1)?
- What if it's manipulated during the attack?
```

### Parameter Exploration

#### Attack Timing
```
Instead of: Attack at beginning
Try: Attack in middle, Attack at end, Attack split across blocks
```

#### Attack Scale
```
Instead of: Attack with large amount
Try: Attack with dust amount, Attack with exact threshold
```

#### Attack Sequence
```
Instead of: A → B → C
Try: A → C → B, B → A → C, Parallel execution
```

---

## Mutation Strategy 4: Trust Boundary Violation

### Concept
Exploit assumptions about which contracts/users are trusted.

### Method
```
1. Identify all trust assumptions
2. Ask "what if this trust is misplaced?"
3. Test untrusted input at trust boundaries
```

### Trust Boundary Patterns

#### Malicious Token
```
Assumption: ERC20 tokens behave normally
Violation: Token with hooks, fees, or callbacks
Result: Reentrancy, accounting errors
```

#### Malicious Oracle
```
Assumption: Oracle price is accurate
Violation: Manipulable oracle, stale data
Result: Liquidation manipulation, undercollateralized loans
```

#### Malicious User Contract
```
Assumption: Users are EOAs or benign contracts
Violation: Attacker controls contract with hooks
Result: Reentrancy, gas griefing
```

---

## Mutation Strategy 5: State Space Exploration

### Concept
Explore combinations of state variables to find invalid states.

### Method
```
1. Define all state variables: S1, S2, S3, ..., Sn
2. Define valid ranges for each
3. Explore edge cases:
   - All minimum
   - All maximum
   - Mixed extremes
   - Transition states
```

### State Mutation Examples

#### Empty States
```
Scenario: First user interaction
Test: Does protocol handle empty/zero states correctly?
Attack: First depositor exploit, division by zero
```

#### Maximum States
```
Scenario: Maximum values reached
Test: Does protocol handle overflow, gas limits?
Attack: Block protocol with max deposits
```

#### Race Conditions
```
Scenario: Multiple users simultaneously
Test: Is state update atomic?
Attack: Double withdrawal, reward stealing
```

---

## Mutation Strategy 6: Economic Game Theory

### Concept
Model the system as a game and find Nash equilibria that harm the protocol.

### Method
```
1. Identify players and their strategies
2. Calculate payoffs for each strategy combination
3. Find dominant strategies for attackers
4. Check if honest participation is rational
```

### Economic Attacks

#### MEV Extraction
```
Attack: Sandwich user's trade
Mutation: Sandwich liquidation, governance votes, claims
```

#### Governance Attacks
```
Attack: Buy tokens, vote, sell
Mutation: Flash loan governance, vote delegation manipulation
```

#### Liquidity Attacks
```
Attack: Remove liquidity at critical moment
Mutation: Just-in-time liquidity, liquidity sniping
```

---

## Practical Application

### Step-by-Step Mutation Process

```
Step 1: Catalog Known Patterns
- List all known vulnerabilities for protocol type
- Document standard mitigations

Step 2: Generate Mutations
- Apply each mutation strategy
- Generate 3-5 variations per strategy

Step 3: Feasibility Check
- Which mutations are technically possible?
- Which have economic incentive?
- Which bypass existing mitigations?

Step 4: Prioritize Testing
- Rank by likelihood of success
- Rank by potential impact
- Test top 3-5 mutations

Step 5: Document Results
- Successful mutations → poc/
- Failed mutations → failed-hypotheses/
```

### Mutation Worksheet

```markdown
## Pattern: [Base Pattern]

### Context Shift
- Original: [Context A]
- Shifted: [Context B]
- Feasibility: [High/Medium/Low]
- Notes: [Why or why not]

### Feature Composition
- Feature A: [Feature]
- Feature B: [Feature]
- Combined Effect: [What happens]
- Feasibility: [High/Medium/Low]

### Parameter Manipulation
- Parameter: [Which parameter]
- Variation: [How varied]
- Result: [Effect]

### Trust Boundary
- Assumption: [What is assumed]
- Violation: [How to violate]
- Exploit: [Attack vector]
```

---

## Integration with Novel Discovery

Use this framework within the 6-phase discovery process:
- **Phase 3 (Economic):** Economic game theory mutations
- **Phase 4 (State Machine):** State space exploration
- **Phase 5 (Composition):** Feature composition
- **Phase 2 (Break Assumptions):** Trust boundary violation

---

## Links
- [[attack-patterns/state-inconsistency]] — Base pattern for mutations
- [[invariant-catalog/defi-invariants]] — Test invariants against mutations
- [[../skills/novel-discovery]] — Full discovery framework
