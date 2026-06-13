# Cross-Program Invocation (CPI) Attacks

tags: #vulnerability #solana #cpi #critical

---

## Summary
Cross-Program Invocation (CPI) allows Solana programs to call other programs. If not properly secured, CPIs can lead to reentrancy, unauthorized actions, and privilege escalation.

---

## Pattern Recognition

### Code Signals
- `invoke()` or `invoke_signed()` calls
- CPI to programs whose address comes from user input
- Missing return value checks on CPI
- PDA signing with uncontrolled seeds
- Programs that call back (callbacks via CPI)

### Detection Query
```
Is the CPI target program address hardcoded or user-provided?
Is the CPI return value checked?
Can the called program reenter the caller?
Are PDA seeds validated before signing?
```

---

## Variants

### CPI Reentrancy
```
Program A calls Program B via CPI
Program B calls back into Program A
Program A's state is in an inconsistent mid-transaction state
```

### Arbitrary CPI
```
Attacker controls which program is called
Malicious program returns fabricated data
Caller trusts unchecked CPI result
```

### PDA Signing Bypass
```
Program B expects PDA-signed CPI from Program A
Program A's seeds can be manipulated
Attacker signs for wrong PDA
```

### CPI Return Value Manipulation
```
Program A calls Program B for a price
Program B returns manipulated price
Program A acts on false data
```

---

## Attack Strategy

```
1. Find a CPI that calls an external program
2. Check if the program address is validated
3. If yes, check if reentrancy is possible
4. If the called program can call back during CPI:
   - Enter the first function
   - CPI triggers callback
   - Callback reenters caller before state update
```

---

## Detection Signals
- CPI with user-provided `program_id`
- No `require_keys_eq!` on program address
- `invoke` instead of `invoke_signed` where PDA signing needed
- Missing `Ok(())` return check from CPI

---

## PoC Template (Rust)

```rust
#[program]
pub fn exploit(ctx: Context<ExploitCpi>) -> Result<()> {
    // Call target which will CPI back to us
    let target = &ctx.accounts.target_program;
    let ix = target::instruction::vulnerable_fn(
        ctx.accounts.target_data.key(),
    );

    invoke(&ix, &[/* accounts */])?; // Callback triggers reentrancy
    Ok(())
}
```

---

## Fix

```rust
// 1. Validate program ID
require_keys_eq!(
    ctx.accounts.target_program.key(),
    EXPECTED_PROGRAM_ID
);

// 2. Check CPI return
let result = invoke(&ix, &accounts);
require!(result.is_ok(), MyError::CpiFailed);

// 3. Use reentrancy guard
// Update state BEFORE CPI call
```

---

## Real World Examples
- Solana Wormhole bridge (2022) — $320M lost via CPI validation bypass
- Cashio App (2022) — Arbitrary CPI allowed minting unbacked tokens

---

## Links
- [[solana-account-confusion]]
- [[solana-signer-authorization]]
- [[reentrancy]] (Solana variant)
