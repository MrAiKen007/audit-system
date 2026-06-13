# Unsafe Deserialization & Memory Safety (Rust)

tags: #vulnerability #rust #unsafe #deserialization #high

---

## Summary
Smart contracts written in Rust (Solana, ink!) sometimes use `unsafe` code for performance or custom serialization. Incorrect unsafe usage can lead to memory corruption, undefined behavior, and exploitable vulnerabilities.

---

## Pattern Recognition

### Code Signals
- `unsafe { }` blocks in contract code
- Custom `Pack`/`Unpack` trait implementations
- `std::mem::transmute()` usage
- Raw pointer dereference: `*ptr`, `ptr.read()`, `ptr.write()`
- Union type access
- `#[repr(packed)]` structs
- Manual Borsh deserialization without bounds checks

### Detection Query
```
Is any data deserialized with custom unsafe code?
Are there transmute calls that could reinterpret types?
Are raw pointers used without bounds checking?
Could crafted input cause out-of-bounds reads?
```

---

## Variants

### Bounds Check Bypass
```rust
// Unsafe: no length check before deserialization
unsafe {
    let data = &*(ptr as *const UserData);
    // If input is shorter than UserData, reads OOB memory
}
```

### Type Confusion via Transmute
```rust
// Transmute between unrelated types
unsafe {
    let value: u64 = std::mem::transmute::<[u8; 8], u64>(bytes);
    // If bytes aren't validated, can produce any u64 value
}
```

### Uninitialized Memory
```rust
// Reading uninitialized memory
unsafe {
    let mut data: UserData = std::mem::zeroed();
    // zeroed() may produce invalid enum variants
}
```

### Union Type Confusion
```rust
// Union allows reading same bytes as different types
unsafe {
    u.some_field = value;
    u.other_field; // Reading other field = type confusion
}
```

---

## Attack Strategy

```
1. Identify all unsafe blocks in the contract
2. Check if attacker-controlled input reaches unsafe code
3. Craft input that triggers undefined behavior
4. Exploit resulting memory corruption for privilege escalation
```

---

## Detection Signals
- Any `unsafe` in contract business logic (vs. in crypto library)
- Manual `Pack`/`Unpack` without bounds checks
- Transmuting between types of different sizes

---

## PoC Concept

```rust
// Craft input that causes OOB read in unsafe deserialization
// If custom Pack doesn't check length:
//   Send 3 bytes where 8+ expected
//   Reads uninitialized stack memory
//   Value determines authorization level!
```

---

## Fix

```rust
// Safe: use checked deserialization
pub fn unpack(data: &[u8]) -> Result<Self, ProgramError> {
    if data.len() < Self::LEN {
        return Err(ProgramError::InvalidAccountData);
    }
    // Safe to proceed
    let inner = UserData::try_from_slice(data)
        .map_err(|_| ProgramError::InvalidAccountData)?;
    Ok(inner)
}

// Avoid transmute entirely
// Use safe conversions: from_le_bytes(), from_be_bytes()
let value = u64::from_le_bytes(
    bytes.try_into().map_err(|_| MyError::InvalidLength)?
);
```

---

## Related
- [[solana-account-confusion]]
- [[state-inconsistency]]
