# Account Confusion (Solana)

tags: #vulnerability #solana #account-confusion #critical

---

## Summary
In Solana, all accounts are passed as inputs to instructions. If a program doesn't properly validate which account is which, an attacker can pass the same account in multiple slots or swap accounts of the same type to gain unauthorized access or manipulate state.

---

## Pattern Recognition

### Code Signals (Anchor)
- `AccountInfo` without type checking
- `UncheckedAccount` used where validation is needed
- Same account type used multiple times in a single instruction
- Missing `#[account(owner = ...)]` constraint
- Missing `has_one = ...` constraint
- Accounts passed without checking discriminant or data

### Detection Query
```
Does each Account in the instruction have unique constraints?
Can any two accounts be the same Pubkey?
Is there a check that account A ≠ account B?
Are `has_one` or `seeds` constraints used?
```

---

## Variants

### Same-Account Confusion
Pass the same account as both user A and user B:
```
Instruction expects: [user_a: Signer, user_b: Account]
Attacker passes: [attacker as both user_a and user_b]
Impact: Attacker transfers from user A to user B = from self to self
```

### Type Confusion
Pass an account of the same type but different user:
```
Instruction expects: [vault: Account<Vault>, user_vault: Account<Vault>]
Attacker passes: [user A's vault as both]
Impact: User B's vault state manipulated via user A's vault
```

### Cross-Instruction Confusion
Same account reused across different instructions with different meanings

---

## Attack Strategy

```
1. Identify instruction with multiple accounts of same type
2. Check if there's validation they're different accounts
3. If not, pass same account for both parameters
4. This can: bypass limits, double-spend, or confuse authority
```

---

## Detection Signals
- Multiple `Account<T>` of same type `T` in one instruction
- No `#[account(address = ...)]` or `has_one` constraints
- No `require_keys_neq!(a, b)` checks
- Accounts derived from user input not validated

---

## PoC Template (Anchor/TS)

```typescript
it("account confusion exploit", async () => {
  const victim = anchor.web3.Keypair.generate();

  // Pass victim as BOTH accounts
  const tx = await program.methods
    .vulnerableFunction()
    .accounts({
      accountA: victim.publicKey,
      accountB: victim.publicKey,  // Same!
    })
    .signers([attacker])
    .rpc();
});
```

---

## Fix

```rust
// In Anchor, add constraint to ensure different accounts:
#[derive(Accounts)]
pub struct Transfer<'info> {
    #[account(mut)]
    pub from: Signer<'info>,
    #[account(
        mut,
        constraint = from.key() != to.key() @ MyError::SameAccount
    )]
    pub to: Account<'info, User>,
}

// Or manually:
require_keys_neq!(from.key(), to.key());
```

---

## Real World Examples
- Solana SPL Token program: initial design allowed self-transfer
- Multiple Solana NFT marketplace hacks
- Crema Finance (2022) — account confusion in swap logic

---

## Links
- [[solana-cpi-attacks]]
- [[solana-signer-authorization]]
- [[defi-invariants]]
