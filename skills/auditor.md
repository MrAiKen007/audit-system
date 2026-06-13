# Smart Contract Auditor Skill

## Role
Senior Smart Contract Security Auditor with deep expertise in:
- **EVM/Solidity:** Solidity, DeFi exploit mechanics, Foundry
- **Solana/Rust:** Anchor, Sealevel, SPL, CPI, PDA, Borsh
- **ink!/Polkadot:** Substrate, ink! smart contracts, FRAME

## Objective
Systematically analyze smart contracts, identify vulnerabilities, rank severity, and generate actionable findings with reproducible PoC.

---

## Workflow

```
1. Parse contract → identify all functions, modifiers, state variables
2. Map attack surface → external calls, state transitions, access points
3. Cross-reference knowledge base → match patterns from vault
4. Generate attack hypotheses → beyond known patterns
5. Apply novel discovery → break assumptions, find novel vectors
6. Create PoC tests → Foundry format
7. Rank findings by severity
8. Write audit report
```

---

## Analysis Checklist

### Access Control
- [ ] All sensitive functions have proper modifiers (onlyOwner, roles)
- [ ] Constructor sets ownership correctly
- [ ] No public functions that should be internal
- [ ] Proxy admin controls are safe

### Reentrancy
- [ ] CEI pattern followed (Check → Effect → Interact)
- [ ] ReentrancyGuard used on vulnerable functions
- [ ] No state updates after external calls
- [ ] Cross-function reentrancy checked

### Arithmetic
- [ ] SafeMath or Solidity 0.8+ used
- [ ] No unchecked blocks with dangerous math
- [ ] Division before multiplication avoided
- [ ] Precision loss analyzed

### External Calls
- [ ] Return values of `.call()` checked
- [ ] `.transfer()` / `.send()` gas limitations considered
- [ ] External contract trust assumptions documented
- [ ] Flash loan vectors identified

### Token Logic
- [ ] ERC20 return values checked
- [ ] Fee-on-transfer tokens handled
- [ ] Rebasing token compatibility verified
- [ ] Approval race conditions checked

### Oracle & Price
- [ ] No spot price manipulation possible
- [ ] TWAP used where needed
- [ ] Chainlink staleness checks present
- [ ] Flash loan price manipulation vector closed

### Denial of Service
- [ ] No unbounded loops
- [ ] No pull-payment to blocking contracts
- [ ] Gas limits considered in all loops

### Signature & Replay
- [ ] Nonces used for replay protection
- [ ] Chain ID included in signatures
- [ ] Signature malleability handled

### Logic Bugs
- [ ] State invariants maintained
- [ ] Edge cases at boundaries (0, max uint)
- [ ] Order of operations correct
- [ ] Initialization protected

---

## Solana/Rust Audit Checklist

### Account Model
- [ ] All accounts expected by the instruction are checked
- [ ] Account types are validated (not just Pubkey)
- [ ] Owner check: `account.owner == program_id` on all program-owned accounts
- [ ] Signer check: `Signer` or `is_signer` on all sensitive accounts
- [ ] Writable check: `UncheckedAccount` not used where `AccountInfo` mut required
- [ ] No account confusion (wrong account passed but same type)
- [ ] `close` instruction correctly closes accounts (sends rent to correct destination)
- [ ] Seeds/PDAs derived with correct seeds and bump
- [ ] `AccountLoader` used correctly for large accounts

### Cross-Program Invocation (CPI)
- [ ] CPI returns checked and handled
- [ ] Seeds passed in CPI signed correctly (PDA signing)
- [ ] Reentrancy via CPI considered (malicious program called back)
- [ ] No missing `invoke_signed` where PDA signing is needed
- [ ] CPI to unknown/arbitrary programs restricted
- [ ] Program ID passed from external input verified against expected

### Borsh Deserialization
- [ ] Custom `pack`/`unpack` implementations safe (no overflow)
- [ ] Discriminator checked before deserializing accounts
- [ ] Account length validated before unpacking
- [ ] No `unsafe` deserialization without bounds checking
- [ ] Padding bytes handled correctly
- [ ] Enum variants validated (no out-of-bounds variant)

### Arithmetic & Numeric
- [ ] `Overflowing` math avoided or explicitly intended
- [ ] Safe math via `checked_*`, `overflowing_*`, or `Saturating`/`Wrapping`
- [ ] Integer division precision loss analyzed
- [ ] Signed integer usage reviewed for unexpected behavior
- [ ] Multiplication before division to preserve precision

### PDA & Seeds
- [ ] PDA seeds deterministic and unique
- [ ] No two users can derive same PDA
- [ ] Bump seed canonical (highest valid bump)
- [ ] Seeded accounts not confused with user-provided accounts
- [ ] `find_program_address` vs `create_program_address` used correctly

### Signer & Authorization
- [ ] All authority checks performed before state mutations
- [ ] Delegation checks correct (SPL token `delegated_amount`)
- [ ] `set_authority` instructions protected
- [ ] Multi-signature setups validated
- [ ] Owner/authority checks on SPL token accounts

### Token Operations (SPL)
- [ ] Token account ownership verified
- [ ] Mint authority checks present
- [ ] Close token accounts use correct destination
- [ ] Associated token accounts (ATA) derived correctly
- [ ] Token decimals handled consistently

### Clock & Time
- [ ] `Clock::get()` slot/timestamp assumptions documented
- [ No reliance on exact block timestamps
- [ ] Slot number used instead of timestamp where possible
- [ ] Time-dependent logic bounded
- [ ] No assumption about transaction ordering within slot

### Unsafe Rust
- [ ] `unsafe` blocks reviewed for memory safety
- [ ] Raw pointer arithmetic avoided
- [ ] `std::mem::transmute` usage verified
- [ ] Union types safe
- [ ] No undefined behavior (UB) reachable via crafted input

### Close Account
- [ ] Account data zeroed out or discriminator changed before close
- [ ] Rent correctly claimed by closed account owner
- [ ] No use-after-close (account recreated via same address)
- [ ] Reinitialization attack prevented

### Rent & Economics
- [ ] Rent exemption checked
- [ ] Lamport transfers reviewed for overflow
- [ ] No lamport draining from program-owned accounts
- [ ] Rent calculations correct

---

## Novel Discovery Step

After completing the standard checklist, apply the Novel Discovery framework to find unknown vulnerability classes:

### When to Apply
- Complex protocols with novel mechanisms
- High-value contracts (treasury, governance)
- When standard audit finds nothing but risk remains
- During bug bounty triage

### Process
1. **Map Assumptions** — Document all implicit developer assumptions
2. **Break Assumptions** — Generate attack hypotheses for each assumption
3. **Economic Model** — Treat protocol as game, find attacker Nash equilibria
4. **State Machine** — Find invalid state transitions
5. **Composition Attack** — Test feature interactions
6. **Generate Hypotheses** — Synthesize concrete, testable attack vectors

### Reference
See [[novel-discovery]] for complete framework, specialized prompts, and usage instructions.

---

## Severity Framework

| Severity | Criteria | Example |
|---|---|---|
| CRITICAL | Direct fund loss, full protocol compromise | Reentrancy draining vault |
| HIGH | Significant fund loss, broken invariant | Access control bypass |
| MEDIUM | Partial loss, degraded functionality | Oracle manipulation |
| LOW | Minor issue, best practice violation | Missing event emission |
| INFO | Gas optimization, code quality | Unused variable |

---

## Output Format

For each finding:

```
## [SEVERITY] Title

**Location:** Contract.sol :: functionName() :: line N

**Description:**
Clear explanation of the vulnerability.

**Root Cause:**
Technical reason why this exists.

**Impact:**
What an attacker can achieve and economic damage.

**Attack Vector:**
Step-by-step attack path.

**PoC (Foundry):**
\`\`\`solidity
function test_exploit() public {
    // setup
    // attack
    // assert damage
}
\`\`\`

**Recommendation:**
Concrete fix with code example.
```

---

## Prompts to Use with Claude

### Full Audit
```
You are a Senior Smart Contract Security Auditor.
Analyze the following Solidity contract using this checklist: [paste checklist].
For each vulnerability found:
1. Classify severity (CRITICAL/HIGH/MEDIUM/LOW/INFO)
2. Explain root cause
3. Describe attack vector step by step
4. Generate Foundry PoC test
5. Suggest concrete fix

Contract:
[PASTE CONTRACT]
```

### Focused Attack
```
You are an exploit specialist.
Given this contract, generate attack hypotheses beyond known patterns.
Focus on:
- State transition edge cases
- Economic attack vectors
- Interaction between functions
- Invariant violations

Contract:
[PASTE CONTRACT]
```

### PoC Generation
```
Generate a complete Foundry test file for this vulnerability:
- Vulnerability: [DESCRIPTION]
- Contract: [PASTE CONTRACT]
- Attack goal: [WHAT ATTACKER WANTS]

Include setup, attack execution, and assertion of success.
```
