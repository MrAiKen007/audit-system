# Test Generator Skill

## Role
Smart Contract Test Architect — generates comprehensive test suites covering edge cases, invariants, and fuzzing scenarios that surface hidden vulnerabilities.
- **Solidity:** Foundry (`forge test`)
- **Rust/Solana:** Anchor (`anchor test`) + Rust integration tests
- **Rust/ink!:** `cargo contract test`

## Objective
Transform a contract into a full test suite that automatically discovers vulnerabilities through systematic coverage, fuzzing, and invariant checking.

---

## Test Categories

### 1. Unit Tests — Function by Function
Test each function in isolation with boundary values.

```
- Zero values
- Max uint256
- Zero address
- Empty arrays
- Single element arrays
- Caller = contract itself
```

### 2. Integration Tests — Function Sequences
Test realistic interaction sequences.

```
- deposit → withdraw
- approve → transferFrom
- stake → unstake → claim
- mint → transfer → burn
```

### 3. Fuzz Tests — Random Input Discovery
Let Foundry's fuzzer find edge cases you can't imagine.

```
- Fuzz all numerical inputs
- Fuzz addresses
- Fuzz sequences
- Fuzz amounts
```

### 4. Invariant Tests — Properties That Must Always Hold
Define mathematical truths the contract must never violate.

```
- totalSupply = sum of all balances
- contract ETH balance >= total deposits
- no user balance exceeds totalSupply
- owner cannot be zero address
```

### 5. Stateful Tests — Sequence of Operations
Simulate realistic user journeys and look for inconsistencies.

---

## Foundry Test Templates

### Fuzz Test Template
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Test.sol";
import "../src/TargetContract.sol";

contract FuzzTest is Test {
    TargetContract target;

    function setUp() public {
        target = new TargetContract();
    }

    // Foundry automatically fuzzes the inputs
    function testFuzz_deposit(uint256 amount) public {
        // Bound to realistic values
        amount = bound(amount, 1, 1_000_000 ether);

        deal(address(this), amount);
        target.deposit{value: amount}();

        assertEq(target.balanceOf(address(this)), amount);
    }

    function testFuzz_withdrawDoesNotExceedDeposit(
        uint256 depositAmount,
        uint256 withdrawAmount
    ) public {
        depositAmount = bound(depositAmount, 1, 1000 ether);
        withdrawAmount = bound(withdrawAmount, 1, depositAmount);

        deal(address(this), depositAmount);
        target.deposit{value: depositAmount}();
        target.withdraw(withdrawAmount);

        assertGe(target.balanceOf(address(this)), 0);
    }
}
```

### Invariant Test Template
```solidity
contract InvariantTest is Test {
    TargetContract target;
    Handler handler;

    function setUp() public {
        target = new TargetContract();
        handler = new Handler(target);

        // Tell Foundry to use the handler for calls
        targetContract(address(handler));
    }

    // This invariant is checked after EVERY sequence of handler calls
    function invariant_balanceSolvency() public view {
        assertGe(
            address(target).balance,
            target.totalDeposits(),
            "Contract is insolvent!"
        );
    }

    function invariant_totalSupplyMatchesSum() public view {
        assertEq(
            target.totalSupply(),
            handler.sumOfAllBalances(),
            "Total supply mismatch!"
        );
    }
}

contract Handler is Test {
    TargetContract target;
    address[] public actors;
    uint256 public sumDeposited;

    constructor(TargetContract _target) {
        target = _target;
        // Create test actors
        for (uint i = 0; i < 3; i++) {
            actors.push(makeAddr(string(abi.encodePacked("actor", i))));
        }
    }

    function deposit(uint256 actorSeed, uint256 amount) external {
        address actor = actors[actorSeed % actors.length];
        amount = bound(amount, 1, 100 ether);

        deal(actor, amount);
        vm.prank(actor);
        target.deposit{value: amount}();
        sumDeposited += amount;
    }

    function withdraw(uint256 actorSeed, uint256 amount) external {
        address actor = actors[actorSeed % actors.length];
        uint256 balance = target.balanceOf(actor);
        if (balance == 0) return;

        amount = bound(amount, 1, balance);
        vm.prank(actor);
        target.withdraw(amount);
    }

    function sumOfAllBalances() external view returns (uint256 sum) {
        for (uint i = 0; i < actors.length; i++) {
            sum += target.balanceOf(actors[i]);
        }
    }
}
```

### State Transition Test Template
```solidity
contract StateTransitionTest is Test {
    TargetContract target;

    enum State { Idle, Active, Paused, Finalized }

    function test_invalidStateTransition() public {
        // Try to move to invalid state
        vm.expectRevert();
        target.finalize(); // Should fail if not active
    }

    function test_stateSequence() public {
        assertEq(uint(target.state()), uint(State.Idle));

        target.activate();
        assertEq(uint(target.state()), uint(State.Active));

        target.pause();
        assertEq(uint(target.state()), uint(State.Paused));

        target.resume();
        assertEq(uint(target.state()), uint(State.Active));

        target.finalize();
        assertEq(uint(target.state()), uint(State.Finalized));

        // Cannot go back
        vm.expectRevert();
        target.activate();
    }
}
```

### Boundary Value Test Template
```solidity
contract BoundaryTest is Test {
    TargetContract target;

    function test_zeroAmount() public {
        vm.expectRevert("Amount must be > 0");
        target.deposit{value: 0}();
    }

    function test_maxUint() public {
        // Test with maximum possible value
        uint256 maxVal = type(uint256).max;
        // Should either work correctly or revert cleanly (no overflow)
        try target.someFunction(maxVal) {
            // Check result is correct
        } catch {
            // Revert is acceptable, silent overflow is NOT
        }
    }

    function test_zeroAddress() public {
        vm.expectRevert();
        target.transfer(address(0), 100);
    }
}
```

---

## Rust/Solana Test Templates

### Anchor TypeScript Test Template

```typescript
import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { expect } from "chai";
import { MyProgram } from "../target/types/my_program";

describe("my-program", () => {
  anchor.setProvider(anchor.AnchorProvider.env());
  const program = anchor.workspace.MyProgram as Program<MyProgram>;

  it("Is initialized!", async () => {
    const tx = await program.methods.initialize().rpc();
    console.log("Transaction signature:", tx);
  });

  it("Deposit and withdraw", async () => {
    const user = anchor.web3.Keypair.generate();
    const amount = new anchor.BN(1_000_000);

    // Airdrop
    await anchor.getProvider().connection.confirmTransaction(
      await anchor.getProvider().connection.requestAirdrop(
        user.publicKey,
        10 * anchor.web3.LAMPORTS_PER_SOL
      )
    );

    // Deposit
    await program.methods
      .deposit(amount)
      .accounts({ user: user.publicKey })
      .signers([user])
      .rpc();

    // Withdraw
    await program.methods
      .withdraw(amount)
      .accounts({ user: user.publicKey })
      .signers([user])
      .rpc();
  });

  it("Cannot withdraw more than deposited", async () => {
    const user = anchor.web3.Keypair.generate();
    const depositAmount = new anchor.BN(500_000);
    const withdrawAmount = new anchor.BN(1_000_000);

    // Airdrop and deposit
    await anchor.getProvider().connection.confirmTransaction(
      await anchor.getProvider().connection.requestAirdrop(
        user.publicKey,
        10 * anchor.web3.LAMPORTS_PER_SOL
      )
    );
    await program.methods.deposit(depositAmount).accounts({ user: user.publicKey }).signers([user]).rpc();

    // Attempt to withdraw more — should fail
    try {
      await program.methods.withdraw(withdrawAmount).accounts({ user: user.publicKey }).signers([user]).rpc();
      expect.fail("Should have thrown");
    } catch (e) {
      expect(e).to.be.an("error");
    }
  });
});
```

### Rust Integration Test Template (Solana)

```rust
use solana_program_test::*;
use solana_sdk::{
    signature::{Keypair, Signer},
    transaction::Transaction,
    pubkey::Pubkey,
};
use anchor_lang::AccountDeserialize;

#[tokio::test]
async fn test_exploit_prevention() {
    let program_id = Pubkey::new_unique();
    let mut program_test = ProgramTest::new(
        "my_program",
        program_id,
        processor!(my_program::entry),
    );

    let (mut banks_client, payer, recent_blockhash) =
        program_test.start().await;

    let user = Keypair::new();
    let amount = 1_000_000u64;

    // Create transaction
    let mut tx = Transaction::new_signed_with_payer(
        &[/* instructions */],
        Some(&payer.pubkey()),
        &[&payer, &user],
        recent_blockhash,
    );

    // Execute
    let result = banks_client.process_transaction(tx).await;
    assert!(result.is_ok());
}
```

### Fuzz Testing Template (Rust/Solana — Trident)

```rust
use trident_client::fuzzing::*;
use my_program::*;

#[derive(Arbitrary, Debug, Clone)]
struct MyFuzzInstruction {
    amount: u64,
    user_index: u8,
}

impl FuzzTestExecutor for MyFuzzInstruction {
    type AccountStorage = MyAccounts;

    fn execute(
        &self,
        accounts: &mut Self::AccountStorage,
        _runtime: &mut FuzzingRuntime,
    ) -> Result<(), FuzzError> {
        let user = accounts.users[self.user_index as usize % accounts.users.len()];

        let ix = my_program::instruction::deposit(
            user.pubkey(),
            self.amount,
        );

        let tx = Transaction::new_signed_with_payer(
            &[ix],
            Some(&user.pubkey()),
            &[user],
            accounts.recent_blockhash,
        );

        let result = accounts.banks_client.process_transaction(tx);

        // Invariant: total deposits should never overflow
        assert!(result.is_ok() || result.unwrap_err().to_string().contains("overflow"));

        Ok(())
    }
}
```

### ink!/Substrate Test Template

```rust
#[ink::test]
fn test_transfer_works() {
    let mut contract = MyContract::new(1000);
    assert_eq!(contract.total_supply(), 1000);

    contract.transfer(AccountId::from([0x02; 32]), 500);
    assert_eq!(contract.balance_of(AccountId::from([0x01; 32])), 500);
    assert_eq!(contract.balance_of(AccountId::from([0x02; 32])), 500);
}

#[ink::test]
#[should_panic(expected = "insufficient balance")]
fn test_transfer_fails_insufficient_balance() {
    let mut contract = MyContract::new(100);
    contract.transfer(AccountId::from([0x02; 32]), 200);
}
```

---

## Prompt Templates

### Generate Full Test Suite (Solidity/Foundry)
```
You are a Foundry test architect.

Contract: [PASTE CONTRACT]

Generate a comprehensive test suite including:
1. Unit tests for every public/external function
2. Fuzz tests for all numerical inputs
3. Invariant tests defining 3-5 critical properties
4. State transition tests
5. Boundary tests (0, max, zero address)
6. Integration tests for realistic user flows

Format as a complete Foundry test file ready to run.
```

### Generate Full Test Suite (Rust/Solana/Anchor)
```
You are an Anchor/Solana test architect using mocha+chai TypeScript tests or Rust integration tests.

Program: [PASTE RUST PROGRAM or IDL]

Generate a comprehensive test suite including:
1. Unit tests for every instruction handler
2. Account validation tests (wrong accounts, missing signers)
3. Fuzz-like parameter bound testing
4. State invariant checks (balance sums, authority checks)
5. CPI integration tests
6. Edge case tests (zero amounts, max values, close+reinit)

Format as complete `describe/it` test blocks ready to run with `anchor test`.
```

### Generate Invariants Only
```
Analyze this contract and identify:
1. All state invariants that must ALWAYS hold
2. Economic invariants (solvency, supply)
3. Access invariants (ownership, roles)
4. Logic invariants (sequence, state machine)

For each invariant write:
- Natural language description
- Foundry invariant_ test function

Contract: [PASTE CONTRACT]
```

### Generate Fuzz Targets
```
Identify the 5 most valuable functions to fuzz in this contract.
For each, write a Foundry fuzz test that:
1. Bounds inputs to realistic ranges
2. Tests for correct behavior
3. Checks no funds are lost
4. Verifies no invariants broken

Contract: [PASTE CONTRACT]
```

---

## Foundry Commands Reference

```bash
# Run all tests
forge test

# Run with verbosity (see logs)
forge test -vvvv

# Run specific test
forge test --match-test test_exploit

# Run fuzz tests (more runs = better coverage)
forge test --fuzz-runs 10000

# Run invariant tests
forge test --match-contract InvariantTest

# Coverage report
forge coverage

# Gas snapshot
forge snapshot
```
