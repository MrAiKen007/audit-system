# Close Account & Reinitialization (Solana)

tags: #vulnerability #solana #close #reinit #high

---

## Summary
In Solana, accounts can be closed to reclaim rent. If not handled correctly, attackers can reinitialize closed accounts to gain unauthorized access or manipulate state.

---

## Pattern Recognition

### Code Signals
- `close` instruction that sends lamports to a destination
- Missing discriminator check on account data
- No `initialized` flag
- Account size can change between close and reinit
- Old account data remains in memory after close

### Detection Query
```
Does close() zero out account data or change discriminator?
Can the same account address be reinitialized after close?
Does every instruction check if account is already initialized?
```

---

## Variants

### Reinitialization Attack
```
1. User creates account A
2. User closes account A (rent reclaimed)
3. Attacker reinitializes account A at same address
4. Attacker now controls what was previously user A's account
```

### Use-After-Close
```
1. Account data is not cleared on close
2. Discriminator not checked before use
3. Old data remains accessible
4. Attacker reads stale data or passes closed-but-not-cleared account
```

### Rent Theft
```
close instruction sends rent to wrong destination
Attacker drains rent from all closable accounts
```

---

## Attack Strategy

```
1. Find close instruction
2. Check if account data is cleared (discriminator reset)
3. Check if all instructions verify account discriminator
4. If discriminator not checked: close → reinit → exploit
```

---

## Detection Signals
- No discriminator check in instruction handlers
- Close instruction doesn't zero out account data
- No `is_initialized` or version field
- Account type can be reinterpreted after reinit

---

## PoC Template (Anchor/TS)

```typescript
it("reinitialization attack", async () => {
  // 1. Create victim's account
  await program.methods
    .initialize()
    .accounts({ user: victim.publicKey })
    .signers([victim])
    .rpc();

  // 2. Close it
  await program.methods
    .close()
    .accounts({ user: victim.publicKey })
    .signers([victim])
    .rpc();

  // 3. Reinitialize with attacker control
  await program.methods
    .initialize()
    .accounts({ user: victim.publicKey })  // Same address!
    .signers([victim])  // Attacker has keypair
    .rpc();

  // 4. Now attacker has elevated privileges
});
```

---

## Fix

```rust
// Anchor: close constraint handles this
#[derive(Accounts)]
pub struct Close<'info> {
    #[account(
        mut,
        close = destination,  // Anchor handles zeroing + rent return
        constraint = user.key == owner.key
    )]
    pub user: Account<'info, UserData>,
    #[account(mut)]
    pub destination: Signer<'info>,
}

// Manual: zero out discriminator
pub fn close(ctx: Context<Close>) -> Result<()> {
    let data = ctx.accounts.user.to_account_info();
    let mut data_bytes = data.data.borrow_mut();
    data_bytes[0..8].copy_from_slice(&[0u8; 8]); // Clear discriminator
    Ok(())
}
```

---

## Real World Examples
- Jet Protocol — reinitialization vulnerability
- Multiple Solana programs with close + reinit patterns

---

## Links
- [[solana-account-confusion]]
- [[solana-signer-authorization]]
