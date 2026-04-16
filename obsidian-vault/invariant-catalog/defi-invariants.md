# DeFi Invariants Catalog

tags: #invariants #defi #catalog #security

---

## Overview
This catalog documents common invariants in DeFi protocols. Each invariant represents a property that must always hold true. Breaking an invariant typically indicates a vulnerability.

---

## Lending Protocol Invariants

### LI-01: Collateralization Ratio
```
invariant: total_collateral >= total_debt * liquidation_threshold / 100
violation: Undercollateralized positions not liquidated
severity: CRITICAL
```

### LI-02: Solvency
```
invariant: contract_token_balance >= total_user_deposits
violation: Users cannot withdraw deposits
severity: CRITICAL
```

### LI-03: Interest Accumulation
```
invariant: debt_amount only increases (or stays same) over time
violation: Debt incorrectly calculated
severity: HIGH
```

### LI-04: Liquidation Economics
```
invariant: liquidation_incentive > 0 && liquidation_incentive < 100%
violation: Liquidators lose money or can extract excessive value
severity: HIGH
```

---

## DEX/AMM Invariants

### DEX-01: Constant Product (x*y=k)
```
invariant: reserve0 * reserve1 >= k (approximately, before fees)
violation: Pool manipulation, price manipulation
severity: CRITICAL
```

### DEX-02: Price Consistency
```
invariant: spot_price ≈ time_weighted_average_price (within reasonable bounds)
violation: Oracle manipulation, flash loan attacks
severity: CRITICAL
```

### DEX-03: LP Token Value
```
invariant: total_lp_supply <= total_reserves (in value terms)
violation: LP tokens minted without backing
severity: CRITICAL
```

### DEX-04: K Invariant Monotonicity
```
invariant: k only increases with fees
violation: Fees not properly collected
severity: MEDIUM
```

---

## Staking Protocol Invariants

### ST-01: Staked Balance
```
invariant: user_staked_balance <= user_token_balance (at deposit time)
violation: Can stake more than owned
severity: CRITICAL
```

### ST-02: Reward Accrual
```
invariant: pending_rewards >= 0 && monotonically increasing
violation: Rewards incorrectly calculated
severity: HIGH
```

### ST-03: Unstaking Period
```
invariant: unstake_time >= stake_time + lock_duration
violation: Early withdrawal possible
severity: HIGH
```

### ST-04: Total Staked
```
invariant: sum(user_stakes) == total_staked
violation: Accounting discrepancy
severity: CRITICAL
```

---

## Governance Token Invariants

### GOV-01: Voting Power
```
invariant: voting_power <= token_balance (or delegated amount)
violation: Double voting
severity: CRITICAL
```

### GOV-02: Proposal Threshold
```
invariant: proposal_creator_votes >= proposal_threshold
violation: Spam proposals
severity: MEDIUM
```

### GOV-03: Execution Delay
```
invariant: execution_time >= creation_time + voting_period + timelock
violation: Premature execution
severity: HIGH
```

### GOV-04: Quorum
```
invariant: for votes + against votes + abstain votes >= quorum (for valid proposals)
violation: Proposals pass without sufficient participation
severity: CRITICAL
```

---

## Vault/Yield Aggregator Invariants

### VAULT-01: Share Price
```
invariant: share_price >= 1e18 (or base value)
violation: First depositor / inflation attack
severity: CRITICAL
```

### VAULT-02: Deposit/Withdraw Ratio
```
invariant: assets_withdrawn ≈ shares_burned * share_price (with tolerance)
violation: Price manipulation, rounding error exploitation
severity: HIGH
```

### VAULT-03: Strategy Allocation
```
invariant: sum(strategy_allocations) == 100%
violation: Funds lost or locked
severity: CRITICAL
```

### VAULT-04: Harvest Timing
```
invariant: harvest_profit > harvest_gas_cost (or harvest blocked)
violation: Loss through excessive harvests
severity: MEDIUM
```

---

## Bridge/Cross-Chain Invariants

### BRIDGE-01: Token Conservation
```
invariant: tokens_locked_on_source == tokens_minted_on_target (per user)
violation: Double minting, unbacked tokens
severity: CRITICAL
```

### BRIDGE-02: Verification
```
invariant: message must be signed by threshold of validators
violation: Unauthorized minting/burning
severity: CRITICAL
```

### BRIDGE-03: Nonce Uniqueness
```
invariant: each bridge transaction has unique nonce
violation: Replay attacks
severity: CRITICAL
```

---

## Token Standard Invariants

### ERC20-01: Balance Conservation
```
invariant: sum(all_balances) == total_supply (with allowances caveat)
violation: Inflation bugs, minting exploits
severity: CRITICAL
```

### ERC20-02: Approval
```
invariant: transferFrom succeeds only if allowance >= amount
violation: Unauthorized transfers
severity: CRITICAL
```

### ERC721-01: Ownership
```
invariant: ownerOf(tokenId) returns single address
violation: Double ownership
severity: CRITICAL
```

---

## Insurance Protocol Invariants

### INS-01: Capital Pool
```
invariant: capital_pool >= total_coverage_amount * risk_factor
violation: Insufficient funds for claims
severity: CRITICAL
```

### INS-02: Claim Validity
```
invariant: claim_amount <= coverage_amount && claim_approved == true
violation: Fraudulent claims
severity: HIGH
```

### INS-03: Premium Calculation
```
invariant: premium >= expected_claims / capital_pool (simplified)
violation: Underpricing, insolvency
severity: HIGH
```

---

## Derivatives/Options Invariants

### DER-01: Collateralization
```
invariant: collateral >= max_payout (for sellers)
violation: Unable to pay out
severity: CRITICAL
```

### DER-02: Exercise Validity
```
invariant: option_exercisable only if strike_price conditions met
violation: Invalid exercise
severity: HIGH
```

### DER-03: Settlement
```
invariant: settlement_price >= 0 && settlement_price <= market_price * max_multiple
violation: Oracle manipulation
severity: CRITICAL
```

---

## Using This Catalog

### During Audit
1. Identify protocol type
2. Review relevant invariants
3. Test each invariant with property-based tests
4. Document any violations

### Hypothesis Generation
```
Pattern: "What if [INVARIANT] is violated via [ATTACK_VECTOR]?"
Example: "What if total_collateral < total_debt via flash loan manipulation?"
```

### Tool Integration
Use with:
- Echidna: Define as `invariant()` functions
- Foundry: Write as `testInvariant_*` tests
- Certora: Specify as `invariant` rules

---

## Links
- [[attack-patterns/state-inconsistency]] — Many invariants enforce state consistency
- [[test-strategies/invariant-testing]] — How to test these
- [[novel-patterns/pattern-mutation-framework]] — Combine invariants for novel attacks
