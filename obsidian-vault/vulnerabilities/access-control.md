# Access Control

tags: #vulnerability #high #critical #access-control

---

## Summary
Access control vulnerabilities occur when sensitive functions lack proper authorization checks, allowing unauthorized actors to execute privileged operations.

---

## Pattern Recognition

### Code Signals
- `public` functions that should be `internal` or `onlyOwner`
- Missing modifiers on admin functions
- Modifier logic that can be bypassed
- `tx.origin` used instead of `msg.sender`
- Role checks missing or incorrectly implemented

### Detection Query for Claude
```
Which functions modify critical state or move funds?
Do all of them have proper access modifiers?
Can the modifier be bypassed (e.g., through delegatecall)?
Is tx.origin used anywhere?
```

---

## Variants

### Missing Modifier
Function performs sensitive action with no access check at all.

### Broken Modifier Logic
```solidity
modifier onlyOwner() {
    require(msg.sender == owner || owner == address(0)); // WRONG: anyone when owner not set
    _;
}
```

### Uninitialized Owner
Owner is never set in constructor, defaults to `address(0)`, anyone can become owner.

### tx.origin Bypass
```solidity
require(tx.origin == owner); // Bypassed via phishing
```

### Delegatecall Context Confusion
Proxy calls implementation — `msg.sender` changes context, breaking access checks.

---

## Attack Strategy

```
1. Identify functions with weak or missing access control
2. Call function directly from attacker EOA
3. OR deploy attacker contract to bypass tx.origin check
4. Execute privileged action (drain funds, set new owner, pause protocol)
```

---

## Detection Signals
- `function X() public` with no modifier on state-changing operation
- `initialize()` or `setup()` functions with no protection
- `owner` never assigned in constructor
- Access checks using `tx.origin`

---

## PoC Template

```solidity
function test_accessControlBypass() public {
    address attacker = makeAddr("attacker");

    vm.startPrank(attacker);
    target.sensitiveAdminFunction(); // Should revert but doesn't
    vm.stopPrank();

    // Assert unauthorized action succeeded
    assertEq(target.owner(), attacker);
}
```

---

## Fix

```solidity
// Use OpenZeppelin Ownable or AccessControl
import "@openzeppelin/contracts/access/Ownable.sol";

contract Fixed is Ownable {
    function sensitiveFunction() external onlyOwner {
        // safe
    }
}

// For roles:
import "@openzeppelin/contracts/access/AccessControl.sol";
bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
// use hasRole(ADMIN_ROLE, msg.sender)
```

---

## Real World Examples
- Parity Multisig (2017) — $30M
- Compound (2021) — $80M governance
- Nomad Bridge (2022) — $190M

---

## Links
- [[attack-patterns/privilege-escalation]]
- [[vulnerabilities/signature-replay]]
