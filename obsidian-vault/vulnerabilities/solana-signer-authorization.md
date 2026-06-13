# Signer & Authorization Vulnerabilities (Solana)

tags: #vulnerability #solana #signer #authorization #critical

---

## Summary
Solana requires explicit signer checks on every account that needs authorization. Missing or incorrect signer checks allow attackers to impersonate any user.

---

## Pattern Recognition

### Code Signals (Anchor)
- `AccountInfo` without `Signer` type
- `UncheckedAccount` used where authorization is needed
- Missing `#[account(signer)]` constraint
- Missing `owner` field check on token accounts
- Authority check done AFTER state modification

### Detection Query
```
Does every state-modifying instruction check msg.signer equivalent?
Are `Signer` types used for all authorized actors?
Is the authority check performed BEFORE state mutation?
```

---

## Variants

### Missing Signer Check
```
Instruction accepts any account as "authority"
No Signer constraint → attacker passes any pubkey
State modified without real authorization
```

### Owner Check Bypass
```
Token account owner not verified
Attacker passes someone else's token account
Funds transferred from wrong account
```

### Delegate Authorization
```
SPL token delegate permissions not checked
Attacker uses own delegation to move other's tokens
Missing `delegated_amount` verification
```

---

## Attack Strategy

```
1. Find instruction with authority-like account parameter
2. Check if `Signer` constraint or `is_signer` check exists
3. If missing, call instruction with victim's pubkey
4. State is modified as if victim authorized it
```

---

## Detection Signals
- `Account` type without `Signer` for authority roles
- `has_one = authority` but no `Signer` constraint
- Manual `owner` field check not followed by `require_signer`

---

## PoC Template (Anchor/TS)

```typescript
it("missing signer check", async () => {
  // Attacker calls without being the authority
  const tx = await program.methods
    .adminAction()
    .accounts({
      authority: victim.publicKey,  // Not a signer!
      // ... other accounts
    })
    .signers([attacker])  // Only attacker signs
    .rpc();

  // Assert: unauthorized action succeeded
});
```

---

## Fix

```rust
// Anchor: use Signer type
#[derive(Accounts)]
pub struct AdminAction<'info> {
    #[account(signer)]  // <-- REQUIRED
    pub authority: Signer<'info>,
}

// Or manual:
require!(ctx.accounts.authority.is_signer, MyError::NotSigner);
```

---

## Real World Examples
- Multiple Solana bridge hacks
- Solend protocol — initial admin key lacked proper signer constraints
- Various Solana NFT projects with missing owner checks

---

## Links
- [[solana-account-confusion]]
- [[solana-cpi-attacks]]
- [[access-control]]
