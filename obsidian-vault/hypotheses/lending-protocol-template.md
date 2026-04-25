# Hypothesis Template: Lending Protocol

## Protocol Context
- **Type:** Lending / Borrowing / Money Market
- **Key Components:** Collateral management, interest accrual, liquidation, price feeds
- **Critical Invariants:** Solvency, collateralization ratios, interest rate accuracy

---

## Assumption Mapping

### Developer Assumptions About Collateral
```
ASSUMPTION: Collateral value is accurately represented by oracle
REALITY: Oracle can be manipulated or stale
HYPOTHESIS: Borrow can manipulate collateral value to avoid liquidation

ASSUMPTION: Collateral cannot be rehypothecated
REALITY: LP tokens or derivative collateral can be double-used
HYPOTHESIS: Same collateral backs multiple borrows across protocols
```

### Developer Assumptions About Liquidation
```
ASSUMPTION: Liquidators are rational actors who maintain solvency
REALITY: Liquidators can be malicious or MEV bots
HYPOTHESIS: Liquidation can be griefed or manipulated

ASSUMPTION: Liquidation threshold is safe
REALITY: Rapid price movements can skip liquidation window
HYPOTHESIS: Price oracle lag allows undercollateralized positions
```

### Developer Assumptions About Interest
```
ASSUMPTION: Interest accrues linearly over time
REALITY: Block.timestamp can be manipulated by miners
HYPOTHESIS: Timestamp manipulation affects interest calculation

ASSUMPTION: All borrowers can be liquidated when undercollateralized
REALITY: Liquidation can fail (no liquidity, gas, or griefing)
HYPOTHESIS: Protocol becomes insolvent with bad debt
```

---

## Attack Vectors Specific to Lending

### 1. Oracle Manipulation + Over-Borrowing
```solidity
HYPOTHESIS ID: H-LEND-001
ASSUMPTION BROKEN: "Oracle price reflects true market value"
VIOLATION METHOD: Manipulate collateral price, borrow max, dump
PRECONDITIONS:
  - Collateral token has thin liquidity
  - Oracle reads from manipulable source (spot price)
  - No price sanity bounds
ATTACK SEQUENCE:
  1. Flash loan large amount of collateral token
  2. Buy collateral on DEX, pushing price up 2-5x
  3. Deposit collateral at inflated price
  4. Borrow maximum stablecoins against inflated collateral
  5. Sell collateral, crashing price back down
  6. Position is undercollateralized but liquidation fails
SUCCESS CONDITION: Borrowed value > collateral value at true price
ESTIMATED IMPACT: Protocol insolvency, bad debt
NOVELTY: Specific to oracle source and collateral depth
```

### 2. Liquidation Griefing
```solidity
HYPOTHESIS ID: H-LEND-002
ASSUMPTION BROKEN: "Undercollateralized positions will be liquidated"
REALITY: Liquidation can be made unprofitable or fail
PRECONDITIONS:
  - Liquidation requires external call
  - Liquidation bonus is small
  - Gas costs are significant
ATTACK SEQUENCE:
  1. Identify undercollateralized position
  2. Front-run liquidation with transaction that makes it unprofitable
  3. Or: grief liquidation by manipulating state during call
  4. Position remains, debt grows, protocol becomes insolvent
SUCCESS CONDITION: Position remains undercollateralized for extended period
ESTIMATED IMPACT: Accumulated bad debt
NOVELTY: Economic griefing pattern
```

### 3. Interest Rate Manipulation
```solidity
HYPOTHESIS ID: H-LEND-003
ASSUMPTION BROKEN: "Interest rate formula is manipulation-resistant"
REALITY: Utilization ratio can be temporarily manipulated
PRECONDITIONS:
  - Interest rate based on current utilization
  - No time-weighted averaging
ATTACK SEQUENCE:
  1. Borrow nearly 100% of pool (spike utilization)
  2. Interest rate spikes to maximum
  3. Exploit high rate for flash loan or other mechanism
  4. Repay immediately
SUCCESS CONDITION: Profit from rate spike > gas
ESTIMATED IMPACT: Interest rate volatility, user harm
NOVELTY: Temporal manipulation of rate
```

### 4. Double-Counting Collateral
```solidity
HYPOTHESIS ID: H-LEND-004
ASSUMPTION BROKEN: "Collateral is uniquely owned"
REALITY: Derivative tokens can be deposited multiple times
PRECONDITIONS:
  - Protocol accepts LP tokens or wrapped tokens
  - No tracking of underlying collateral
ATTACK SEQUENCE:
  1. Deposit asset, receive derivative token (e.g., aToken)
  2. Use derivative as collateral in Protocol A
  3. Borrow from A, deposit back into original protocol
  4. Repeat across multiple protocols
  5. Same underlying asset backs multiple borrows
SUCCESS CONDITION: Total borrowed > underlying asset value
ESTIMATED IMPACT: Cascading liquidations, systemic risk
NOVELTY: Cross-protocol rehypothecation
```

### 5. Bad Debt Through Failed Liquidation
```solidity
HYPOTHESIS ID: H-LEND-005
ASSUMPTION BROKEN: "Liquidation always succeeds or reverts"
REALITY: Partial liquidation can leave bad debt
PRECONDITIONS:
  - Liquidation has caps or limits
  - Collateral illiquid
ATTACK SEQUENCE:
  1. Open large position
  2. Collateral value drops rapidly
  3. Liquidation can only sell portion (cap or liquidity)
  4. Remaining debt exceeds remaining collateral
  5. Protocol absorbs loss
SUCCESS CONDITION: Bad debt remains on protocol balance sheet
ESTIMATED IMPACT: LP loss, insolvency risk
NOVELTY: Partial liquidation failure
```

---

## Invariants to Test

```solidity
// INVARIANT 1: Total borrows <= total collateral * maxLTV
assert(totalBorrows <= sum(collateralValues) * maxLTV);

// INVARIANT 2: Protocol solvency
assert(totalCollateralValue >= totalBorrows + accruedInterest);

// INVARIANT 3: Individual position collateralization
for each position: assert(collateralValue >= borrow * liquidationThreshold);

// INVARIANT 4: Interest accrual accuracy
assert(currentInterestIndex >= previousInterestIndex);

// INVARIANT 5: No negative balances
for each user: assert(userBalance >= 0);
```

---

## Foundry Test Skeleton

```solidity
contract LendingHypothesisTest is Test {
    ILendingPool pool;
    IOracle oracle;
    IERC20 collateral;
    IERC20 stablecoin;

    function test_oracleManipulationOverBorrow() public {
        // Setup: Flash loan, identify thin-liquidity collateral
        // Attack: Manipulate oracle, borrow max, dump
        // Assert: Position undercollateralized, bad debt created
    }

    function test_liquidationGriefing() public {
        // Setup: Create undercollateralized position
        // Attack: Grief all liquidation attempts
        // Assert: Position remains, debt grows
    }

    function test_interestRateSpike() public {
        // Setup: Identify pool with low liquidity
        // Attack: Borrow all, spike utilization
        // Assert: Rate manipulation successful
    }

    function test_doubleCountingCollateral() public {
        // Setup: Get derivative token (aToken, cToken, LP)
        // Attack: Deposit same underlying across multiple protocols
        // Assert: Total borrowed > underlying value
    }
}
```

---

## Related Vulnerabilities
- [[../vulnerabilities/oracle-manipulation]]
- [[../vulnerabilities/flash-loan-attack]]
- [[../vulnerabilities/access-control]]

---

## Validation Checklist
- [ ] Hypothesis is testable with Foundry
- [ ] Preconditions are achievable with flash loans
- [ ] Attack sequence is specific to THIS lending protocol
- [ ] Would NOT be found by standard audits
- [ ] Economic incentive exists (profit > cost)
- [ ] Considers cross-protocol interactions
