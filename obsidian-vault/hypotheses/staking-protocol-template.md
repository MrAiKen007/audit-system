# Hypothesis Template: Staking Protocol

## Protocol Context
- **Type:** Staking / Yield Farming / Rewards Distribution
- **Key Components:** Stake/unstake logic, reward accrual, lockup periods, slashing
- **Critical Invariants:** Reward rate accuracy, total staked = sum of shares, slashing correctness

---

## Assumption Mapping

### Developer Assumptions About Rewards
```
ASSUMPTION: Rewards are distributed proportionally to stake
REALITY: Reward calculation can have edge cases at boundaries
HYPOTHESIS: First/last staker can capture disproportionate rewards

ASSUMPTION: Reward rate is constant or predictably variable
REALITY: Reward rate can be manipulated by large stakers
HYPOTHESIS: Stake/unstake timing affects reward rate
```

### Developer Assumptions About Lockups
```
ASSUMPTION: Locked tokens cannot be withdrawn early
REALITY: Governance or emergency functions may bypass lockup
HYPOTHESIS: Emergency withdrawal can be abused

ASSUMPTION: Lockup duration is enforced correctly
REALITY: Timestamp manipulation or edge cases
HYPOTHESIS: Block.timestamp manipulation allows early withdrawal
```

### Developer Assumptions About Slashing
```
ASSUMPTION: Slashing conditions are unambiguous
REALITY: Slashing logic may have edge cases
HYPOTHESIS: Validator can avoid slashing through technicality

ASSUMPTION: Slashed amount is correctly distributed
REALITY: Distribution logic may have bugs
HYPOTHESIS: Slashed rewards go to wrong recipient
```

---

## Attack Vectors Specific to Staking

### 1. Reward Calculation Exploit (First/Last Staker)
```solidity
HYPOTHESIS ID: H-STAKE-001
ASSUMPTION BROKEN: "Rewards are fairly distributed regardless of timing"
VIOLATION METHOD: Exploit reward-per-share calculation at protocol boundaries
PRECONDITIONS:
  - Rewards distributed based on rewardPerShare
  - rewardPerShare updated on stake/unstake
  - Small total stake initially
ATTACK SEQUENCE:
  1. Be first to stake with large amount
  2. rewardPerShare = totalRewards / totalStaked (small denominator)
  3. Later users stake, rewardPerShare diluted
  4. Attacker already captured disproportionate share
  OR:
  1. Stake when rewardPerShare is high
  2. Unstake immediately before others stake
  3. Capture rewards without proportional risk
SUCCESS CONDITION: Rewards captured > proportional to stake time/amount
ESTIMATED IMPACT: Later stakers receive fewer rewards
NOVELTY: Timing-based exploitation of reward formula
```

### 2. Stake/Unstake Flash Manipulation
```solidity
HYPOTHESIS ID: H-STAKE-002
ASSUMPTION BROKEN: "Stakers have skin in the game"
REALITY: Flash loans allow temporary stake for voting/rewards
PRECONDITIONS:
  - No minimum stake duration
  - Rewards/voting rights granted immediately
ATTACK SEQUENCE:
  1. Flash loan large amount
  2. Stake and immediately claim voting rights or rewards
  3. Use voting power to pass malicious proposal
  4. Or: claim rewards meant for long-term stakers
  5. Unstake and repay flash loan
SUCCESS CONDITION: Achieve governance control or claim rewards without capital
ESTIMATED IMPACT: Governance capture or unfair reward distribution
NOVELTY: Flash loan usage for temporary stake
```

### 3. Reward Rate Manipulation
```solidity
HYPOTHESIS ID: H-STAKE-003
ASSUMPTION BROKEN: "Reward rate is independent of staker behavior"
REALITY: Large stake/unstake can change reward rate
PRECONDITIONS:
  - Reward rate based on utilization or TVL
  - No rate limits or dampening
ATTACK SEQUENCE:
  1. Stake large amount, triggering reward rate increase
  2. Other stakers attracted by high rate join
  3. Unstake suddenly, rate crashes
  4. Remaining stakers trapped with low/no rewards
  OR:
  1. Manipulate rate to maximum
  2. Claim rewards at inflated rate
  3. Exit before rate normalizes
SUCCESS CONDITION: Profit from rate manipulation
ESTIMATED IMPACT: Reward system instability
NOVELTY: Rate manipulation attack
```

### 4. Lockup Bypass Through Reentrancy
```solidity
HYPOTHESIS ID: H-STAKE-004
ASSUMPTION BROKEN: "Lockup period is strictly enforced"
REALITY: Reentrancy can bypass time checks
PRECONDITIONS:
  - unstake() makes external call before time check completes
  - Callback allows reentrant unstake
ATTACK SEQUENCE:
  1. Stake with lockup period
  2. Call unstake() immediately
  3. In external call (token callback), call unstake() again
  4. State not yet updated, lockup check passes twice
  5. Withdraw before lockup expires
SUCCESS CONDITION: Tokens withdrawn before lockup end
ESTIMATED IMPACT: Lockup mechanism bypassed
NOVELTY: Reentrancy bypass of time-based restriction
```

### 5. Slashing Condition Exploitation
```solidity
HYPOTHESIS ID: H-STAKE-005
ASSUMPTION BROKEN: "Slashing conditions cover all attack vectors"
REALITY: Slashing logic may have gaps or edge cases
PRECONDITIONS:
  - Slashing based on specific conditions (downtime, double-sign)
  - No comprehensive coverage
ATTACK SEQUENCE:
  1. Identify gap in slashing conditions
  2. Act maliciously without triggering slash (e.g., selective downtime)
  3. Extract value while avoiding penalty
  4. Or: Frame another validator for slashing
SUCCESS CONDITION: Malicious behavior without penalty
ESTIMATED IMPACT: Protocol security degraded
NOVELTY: Logic gap in slashing mechanism
```

---

## Invariants to Test

```solidity
// INVARIANT 1: Total staked = sum of all user shares
assert(totalStaked == sum(userShares));

// INVARIANT 2: Rewards distributed = rewards accrued
assert(totalRewardsDistributed == sum(userRewards) + unclaimedRewards);

// INVARIANT 3: Lockup is enforced
for each user with locked stake:
  assert(block.timestamp >= user.unlockTime || user.stakeAmount == 0);

// INVARIANT 4: Reward rate bounds
assert(rewardRate >= minRate && rewardRate <= maxRate);

// INVARIANT 5: No user has negative balance
for each user: assert(userShare >= 0 && userRewards >= 0);
```

---

## Foundry Test Skeleton

```solidity
contract StakingHypothesisTest is Test {
    IStakingContract staking;
    IERC20 stakeToken;
    IERC20 rewardToken;

    function test_firstStakerRewardExploit() public {
        // Setup: Fresh protocol, no stakers
        // Attack: Be first to stake large amount
        // Assert: Disproportionate rewards captured
    }

    function test_flashLoanStakeManipulation() public {
        // Setup: Governance vote or reward distribution pending
        // Attack: Flash loan, stake, vote/claim, unstake, repay
        // Assert: Governance captured or rewards claimed without capital
    }

    function test_lockupBypassReentrancy() public {
        // Setup: Stake with lockup period
        // Attack: Reentrant unstake calls
        // Assert: Tokens withdrawn before lockup expires
    }

    function test_rewardRateManipulation() public {
        // Setup: Identify rate formula
        // Attack: Large stake/unstake to manipulate rate
        // Assert: Rate spiked, profit extracted
    }
}
```

---

## Related Vulnerabilities
- [[../vulnerabilities/reentrancy]]
- [[../vulnerabilities/access-control]]
- [[../attack-patterns/state-inconsistency]]

---

## Validation Checklist
- [ ] Hypothesis is testable with Foundry
- [ ] Exploits staking-specific mechanics
- [ ] Not a generic reentrancy/access control issue
- [ ] Economic incentive exists
- [ ] Considers timing and sequencing attacks
- [ ] Accounts for flash loan capabilities
