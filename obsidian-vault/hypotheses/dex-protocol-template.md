# Hypothesis Template: DEX Protocol

## Protocol Context
- **Type:** DEX / AMM / Order Book
- **Key Components:** Liquidity pools, price oracle, swap logic, LP tokens
- **Critical Invariants:** Constant product (x*y=k), price accuracy, LP share correctness

---

## Assumption Mapping

### Developer Assumptions About Price
```
ASSUMPTION: Spot price accurately reflects market price
REALITY: Spot price can be manipulated with flash loans
HYPOTHESIS: Attack can manipulate price to extract value from dependent protocols

ASSUMPTION: TWAP cannot be manipulated within single block
REALITY: Multiple swaps in same block can affect TWAP window
HYPOTHESIS: Gradual manipulation over TWAP period
```

### Developer Assumptions About Liquidity
```
ASSUMPTION: LP providers are honest participants
REALITY: LP can be malicious with majority liquidity
HYPOTHESIS: Malicious LP can drain fees or manipulate exits

ASSUMPTION: Liquidity is always available for swaps
REALITY: Liquidity can be removed atomically
HYPOTHESIS: Sandwich attack with liquidity removal
```

### Developer Assumptions About LP Tokens
```
ASSUMPTION: LP token supply matches pool reserves
REALITY: Fee-on-transfer LP tokens break accounting
HYPOTHESIS: Use malicious LP token with fee-on-transfer

ASSUMPTION: LP token transfers are simple
REALITY: LP token may have callbacks or hooks
HYPOTHESIS: Reentrancy via LP token callback
```

---

## Attack Vectors Specific to DEX

### 1. Flash Loan Price Manipulation
```solidity
HYPOTHESIS ID: H-DEX-001
ASSUMPTION BROKEN: "Price cannot be manipulated without significant capital"
VIOLATION METHOD: Flash loan + massive swap + reverse swap
PRECONDITIONS:
  - Pool has insufficient liquidity relative to flash loan capacity
  - No price sanity checks
  - Dependent protocol reads spot price
ATTACK SEQUENCE:
  1. Flash loan 10M USDC
  2. Swap USDC→ETH, pushing ETH price 10x
  3. Call vulnerable protocol that reads manipulated price
  4. Extract over-collateralized loan or liquidate unfairly
  5. Swap ETH→USDC (reverse)
  6. Repay flash loan
SUCCESS CONDITION: Profit > flash loan fee + gas
ESTIMATED IMPACT: Full protocol insolvency
NOVELTY: Specific to this pool's liquidity depth
```

### 2. Liquidity Removal Attack
```solidity
HYPOTHESIS ID: H-DEX-002
ASSUMPTION BROKEN: "Liquidity is stable during user operations"
VIOLATION METHOD: Atomic liquidity add/remove sandwich
PRECONDITIONS:
  - User transaction visible in mempool
  - No slippage protection or weak checks
ATTACK SEQUENCE:
  1. Front-run: Add liquidity
  2. Victim: Swaps at worse rate due to added liquidity
  3. Back-run: Remove liquidity + captured fees
SUCCESS CONDITION: Captured value > gas costs
ESTIMATED IMPACT: Systematic value extraction from all traders
NOVELTY: MEV extraction pattern
```

### 3. Fee-on-Transfer Token Attack
```solidity
HYPOTHESIS ID: H-DEX-003
ASSUMPTION BROKEN: "token.transfer(amount) transfers exactly amount"
VIOLATION METHOD: Use malicious token with 99% fee
PRECONDITIONS:
  - DEX accepts arbitrary tokens
  - Accounting assumes transferIn == transferOut
ATTACK SEQUENCE:
  1. Deposit malicious token with fee
  2. DEX credits based on expected amount
  3. Withdraw: DEX sends less due to fee
  4. DEX absorbs loss or breaks invariant
SUCCESS CONDITION: DEX becomes insolvent
ESTIMATED IMPACT: LP loss proportional to fee discrepancy
NOVELTY: Token behavior assumption
```

### 4. Reentrancy via Flash Callback
```solidity
HYPOTHESIS ID: H-DEX-004
ASSUMPTION BROKEN: "Flash loan callback is the only reentry point"
VIOLATION METHOD: Reenter swap function during callback
PRECONDITIONS:
  - Flash loan callback not properly guarded
  - State updated after external call
ATTACK SEQUENCE:
  1. Flash loan token A
  2. Swap A→B (callback triggered)
  3. In callback, swap B→A before state update
  4. Extract profit from price discrepancy
SUCCESS CONDITION: Profit > flash loan fee
ESTIMATED IMPACT: Pool drained through repeated swaps
NOVELTY: Cross-function reentrancy
```

---

## Invariants to Test

```solidity
// INVARIANT 1: Pool solvency
assert(address(pool).balance >= totalLPShares * pricePerShare);

// INVARIANT 2: Price bounds
assert(currentPrice >= minPrice && currentPrice <= maxPrice);

// INVARIANT 3: LP token accounting
assert(totalLPShares == sum(allUserBalances));

// INVARIANT 4: Constant product (for AMM)
assert(reserveA * reserveB >= initialK); // Allow increase from fees
```

---

## Foundry Test Skeleton

```solidity
contract DEXHypothesisTest is Test {
    IDEX dex;
    IMaliciousToken maliciousToken;
    address flashLoanProvider;

    function test_flashLoanPriceManipulation() public {
        // Setup: Get flash loan, identify target pool
        // Attack: Execute swap sequence
        // Assert: Price was manipulated and profit extracted
    }

    function test_feeOnTransferDrain() public {
        // Setup: Deposit malicious LP token
        // Attack: Trigger withdrawal
        // Assert: Pool accounting broken
    }

    function test_liquiditySandwich() public {
        // Setup: Identify pending swap in mempool
        // Attack: Add/remove liquidity around victim tx
        // Assert: Value extracted from victim
    }
}
```

---

## Related Vulnerabilities
- [[../vulnerabilities/oracle-manipulation]]
- [[../vulnerabilities/flash-loan-attack]]
- [[../attack-patterns/state-inconsistency]]

---

## Validation Checklist
- [ ] Hypothesis is testable with Foundry
- [ ] Preconditions are achievable
- [ ] Attack sequence is specific to THIS DEX
- [ ] Would NOT be found by Slither/Mythril
- [ ] Economic incentive exists for attacker
