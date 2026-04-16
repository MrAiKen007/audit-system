# Flash Loan Attack

tags: #vulnerability #critical #flashloan #defi

---

## Summary
Flash loans allow borrowing unlimited capital within a single transaction with zero collateral. Attackers use this to amplify economic attacks that would otherwise require enormous capital.

---

## Pattern Recognition

### Code Signals
- Single-block price dependency
- Collateral valued at spot DEX price
- Governance that acts in same block as proposal
- Reward calculations based on snapshot that can be gamed

---

## Attack Strategy

```
1. Identify what asset/position can be inflated with capital
2. Calculate if profit > flash loan fee (0.09% Uniswap, 0.05% Aave)
3. Flash borrow enough to move the market
4. Execute attack
5. Repay + keep profit
```

---

## PoC Template

```solidity
contract FlashLoanAttacker {
    IUniswapV3Pool pool;
    IVulnerable target;

    function attack() external {
        pool.flash(address(this), 1_000_000e18, 0, "");
    }

    function uniswapV3FlashCallback(uint256 fee0, uint256, bytes calldata) external {
        // Execute attack with flash loaned funds
        // ...

        // Repay
        IERC20(token).transfer(address(pool), 1_000_000e18 + fee0);
    }
}
```

---

## Fix
- Use TWAP oracle (30+ minute window)
- Add time delay between actions
- Use Chainlink price feeds

---

## Links
- [[vulnerabilities/oracle-manipulation]]
- [[attack-patterns/price-manipulation]]
