# Solana Program Invariants Catalog

tags: #invariants #solana #anchor #catalog #security

---

## Overview
This catalog documents invariants specific to Solana/Anchor programs. These must ALWAYS hold for secure operation.

---

## Account Model Invariants

### SOL-ACC-01: Account Discrimination
```
invariant: every instruction verifies the account discriminator before reading data
violation: account data misinterpreted, reinitialization attacks
severity: CRITICAL
```

### SOL-ACC-02: Account Ownership
```
invariant: account.owner == expected_program_id for all program-owned accounts
violation: unauthorized account access, fake accounts
severity: CRITICAL
```

### SOL-ACC-03: Account Uniqueness
```
invariant: no two accounts of same type in an instruction can be the same pubkey
  (unless explicitly designed for it)
violation: account confusion, self-dealing
severity: HIGH
```

### SOL-ACC-04: Signer Verification
```
invariant: every privileged action requires a Signer check
violation: unauthorized state modification
severity: CRITICAL
```

### SOL-ACC-05: Writable Permissions
```
invariant: accounts whose data is modified must be marked `mut`
violation: failed transactions, unexpected behavior
severity: HIGH
```

---

## PDA Invariants

### SOL-PDA-01: Deterministic Derivation
```
invariant: PDA seeds produce deterministic, unique addresses
violation: two users share same PDA, fund confusion
severity: CRITICAL
```

### SOL-PDA-02: Canonical Bump
```
invariant: only the canonical (highest valid) bump seed is used
violation: multiple valid bumps create ambiguity
severity: MEDIUM
```

### SOL-PDA-03: Seed Validation
```
invariant: seeds used in PDA derivation are validated against instruction data
violation: arbitrary PDA signing, forged authority
severity: CRITICAL
```

### SOL-PDA-04: PDA Signing
```
invariant: PDA signs via `invoke_signed` with correct seeds and bump
violation: CPI with wrong authority, unauthorized transfers
severity: CRITICAL
```

---

## CPI Invariants

### SOL-CPI-01: Program ID Validation
```
invariant: program_id in CPI is validated against expected constant
violation: arbitrary CPI execution, malicious program calls
severity: CRITICAL
```

### SOL-CPI-02: CPI Return Check
```
invariant: CPI return value is checked for errors
violation: silent failure, incorrect state transition
severity: HIGH
```

### SOL-CPI-03: CPI Reentrancy Protection
```
invariant: contract state is committed before CPI to untrusted program
violation: reentrancy via CPI callback
severity: CRITICAL
```

---

## Token (SPL) Invariants

### SOL-TOK-01: Token Account Ownership
```
invariant: token account owner matches expected authority
violation: unauthorized transfers, token theft
severity: CRITICAL
```

### SOL-TOK-02: Mint Authority
```
invariant: only authorized programs/users can mint new tokens
violation: token inflation, unbacked minting
severity: CRITICAL
```

### SOL-TOK-03: Balance Conservation
```
invariant: sum(token_balances) == total_supply (per mint)
violation: token creation/destruction outside mint/burn
severity: CRITICAL
```

### SOL-TOK-04: Close Account Destination
```
invariant: closed token account lamports go to the correct owner
violation: rent theft, fund loss
severity: HIGH
```

---

## State Machine Invariants

### SOL-SM-01: Discriminator Immutability
```
invariant: account discriminator (first 8 bytes) never changes after init
violation: account reinterpretation, type confusion
severity: CRITICAL
```

### SOL-SM-02: Initialization Check
```
invariant: initialized accounts cannot be reinitialized
violation: reinitialization attack, privilege escalation
severity: HIGH
```

### SOL-SM-03: Close Protection
```
invariant: closed accounts cannot be used without reinitialization
violation: use-after-close, stale data access
severity: HIGH
```

---

## Economic Invariants

### SOL-ECO-01: Solvency
```
invariant: program-owned token balance >= user deposits tracked in program state
violation: insolvency, inability to withdraw
severity: CRITICAL
```

### SOL-ECO-02: Rent Exemption
```
invariant: all program accounts remain rent-exempt
violation: account purged, data loss
severity: MEDIUM
```

### SOL-ECO-03: Fee Correctness
```
invariant: protocol fees are correctly calculated and cannot be bypassed
violation: revenue loss, attacker profit at protocol expense
severity: HIGH
```

---

## Using This Catalog

### During Audit
1. Identify program type (AMM, lending, staking, etc.)
2. Review relevant Solana invariants
3. Test each invariant with Anchor test suite
4. Document any violations

### Hypothesis Generation
```
Pattern: "What if [SOL-INVARIANT] is violated via [ATTACK_VECTOR]?"
Example: "What if SOL-ACC-02 (account ownership) is violated via account confusion?"
Example: "What if SOL-CPI-03 (CPI reentrancy) is violated via malicious program callback?"
```

---

## Links
- [[../vulnerabilities/solana-account-confusion]]
- [[../vulnerabilities/solana-cpi-attacks]]
- [[../vulnerabilities/solana-signer-authorization]]
- [[../vulnerabilities/solana-close-account]]
- [[defi-invariants]] (general DeFi invariants)
