# Novel Vulnerability Discovery Skill

description: Discover unknown vulnerability classes by breaking developer assumptions through systematic 6-phase adversarial analysis
type: skill
---

## Role
Smart Contract Security Researcher specializing in discovering previously unknown vulnerability classes and attack vectors through systematic assumption breaking and creative reasoning.

## Objective
Go beyond known vulnerability patterns to discover novel attack vectors that automated scanners and checklists miss. **DESTROY the developer's assumptions.**

---

## Filosofia Central

> Auditores que apenas procuram padrões conhecidos encontram bugs que qualquer scanner automatizado já encontraria.
> Auditores que vencem Code4rena fazem algo diferente: **quebram as suposições do desenvolvedor**.
>
> Todo contrato foi escrito por alguém que acreditava em certas verdades.
> A vulnerabilidade vive exatamente onde essa crença está errada.

---

## O Prompt Principal (copie e use direto)

```
You are an adversarial smart contract researcher.
Your goal is NOT to find known vulnerability patterns.
Your goal is to DESTROY the developer's assumptions.

CONTRACT:
[PASTE CONTRACT]

---

PHASE 1 — MAP DEVELOPER ASSUMPTIONS

List every implicit assumption the developer made:
- About who calls each function (and when)
- About the order operations happen in
- About what external contracts do
- About token behavior (fees? rebasing? pausing?)
- About economic rationality of users
- About what values are possible (min, max, zero)
- About what happens at state transitions
- About time (block.timestamp manipulation, delays)
- About atomicity (what can be front-run or sandwiched?)

For each assumption, write:
ASSUMPTION: [developer believes X]
REALITY: [X can be violated because Y]
HYPOTHESIS: [IF we violate X, THEN consequence Z happens]

---

PHASE 2 — BREAK EACH ASSUMPTION

For every assumption identified, ask:
1. Can this be violated in a SINGLE transaction?
2. Can this be violated across MULTIPLE transactions?
3. Can this be violated with a FLASH LOAN?
4. Can this be violated by a MALICIOUS CONTRACT as caller?
5. Can this be violated by FRONT-RUNNING this transaction?
6. Can this be violated by GRIEFING (denying service)?

---

PHASE 3 — ECONOMIC ADVERSARIAL MODELING

Imagine a purely rational, profit-maximizing attacker.
They have unlimited capital (flash loans), unlimited block space knowledge (MEV), and will run any sequence of operations.

For each external-facing function:
- What is the WORST CASE if someone calls this with maximum adversarial intent?
- Can this function be used to extract value from OTHER users?
- Can this function be used to manipulate state in a way that benefits the caller at the expense of the protocol?
- Is there a sequence of calls that extracts more than was deposited?

---

PHASE 4 — STATE MACHINE ATTACK

Draw the complete state machine of this contract.
Every variable that changes is a state dimension.

For each pair of functions (A, B):
- What is the state after A() then B()?
- What is the state after B() then A()?
- Are these the same? Should they be?
- Is there any state where B() should be unreachable but isn't?
- Can A() be called twice before B() processes the first call?

Identify the RAREST STATE — the combination of variable values least tested.
Generate an attack that reaches that state.

---

PHASE 5 — COMPOSITION ATTACK

This contract does not exist in isolation.
It interacts with tokens, oracles, other protocols.

For each external dependency:
- What if this dependency LIES? (malicious token, fake oracle)
- What if this dependency FAILS SILENTLY? (return false instead of reverting)
- What if this dependency BEHAVES UNEXPECTEDLY? (fee-on-transfer, rebasing, blacklisting)
- What if this dependency is CONTROLLED BY THE ATTACKER? (custom ERC20 with callback)

---

PHASE 6 — NOVEL HYPOTHESIS OUTPUT

For each broken assumption, generate a hypothesis in this format:

HYPOTHESIS ID: H-[N]
ASSUMPTION BROKEN: [what the developer believed]
VIOLATION METHOD: [how to break it]
PRECONDITIONS: [what must be true before attack]
ATTACK SEQUENCE:
  1. [step]
  2. [step]
  3. [step]
SUCCESS CONDITION: [how to know it worked]
ESTIMATED IMPACT: [funds at risk / protocol damage]
NOVELTY: [why this is NOT a standard known pattern]
FOUNDRY TEST SKETCH:
  function test_H[N]_hypothesis() public {
    // setup preconditions
    // execute violation
    // assert success condition
  }

---

IMPORTANT CONSTRAINTS:
- Do NOT just list reentrancy, overflow, access control as findings
- Every hypothesis must explain WHY it's specific to THIS contract
- Every hypothesis must have a concrete, testable attack path
- Prioritize hypotheses that would NOT be found by Slither or Mythril
- Think like someone who has never seen this contract type before
```

---

## Prompts Especializados por Dimensão

### 1. Quebra de Suposições Econômicas

```
You are a DeFi exploit economist.

Given this contract, model the following scenario:
- 10 users interact with this contract optimally
- 1 of those users is a rational adversary with 1000x more capital
- The adversary can observe all pending transactions

Question: How does the adversary extract value from the other 9 users?

Focus on:
- Sandwich attacks
- Liquidity manipulation
- Reward dilution attacks
- Governance capture
- Price impact exploitation

Contract: [PASTE]
```

---

### 2. Ataque por Sequenciamento Adversarial

```
You are a transaction ordering specialist.

Given these functions in the contract:
[LIST ALL PUBLIC/EXTERNAL FUNCTIONS]

Generate ALL meaningful permutations of calling these functions:
- Which orderings create unexpected state?
- Which orderings allow extraction of value?
- Which orderings permanently break the protocol?

For each dangerous ordering, write the exact call sequence and the resulting damage.

Contract: [PASTE]
```

---

### 3. Ataque por Contrato Malicioso como Caller

```
You are building a malicious contract to attack this protocol.

Your malicious contract will:
1. Implement any interface the target expects
2. Use callbacks (receive, fallback, onERC721Received, etc.) maliciously
3. Return unexpected values from any function
4. Selectively revert or succeed based on conditions

Design the malicious contract that causes maximum damage.
Show the exact Solidity code for the attacker contract.
Show the attack sequence.

Target contract: [PASTE]
```

---

### 4. Análise de Invariantes Quebráveis

```
You are a formal verification researcher.

Identify 10 invariants that SHOULD hold in this contract.
Express each as: "It should NEVER be possible that [X]"

Then, for each invariant, attempt to find a sequence of valid transactions that VIOLATES it.

If you find a violation, it's a vulnerability.
If you can't find one, explain WHY the invariant actually holds.

Contract: [PASTE]
```

---

### 5. Engenharia Reversa das Suposições de Tempo

```
You are a MEV researcher.

Analyze this contract for time-dependent vulnerabilities:

1. BLOCK MANIPULATION: What can a miner/validator do by controlling block.timestamp?
2. FRONT-RUNNING: What transactions, if seen in mempool, can be profitably front-run?
3. SANDWICH: What user transactions can be sandwiched for profit?
4. DELAY ATTACKS: What happens if an expected transaction is delayed by N blocks?
5. DEADLINE GAMING: Are there deadlines that can be hit exactly to extract value?
6. MULTI-BLOCK: What attack requires seeing state across multiple blocks?

Contract: [PASTE]
```

---

### 6. Ataque por Token Malicioso

```
You are designing a malicious ERC20 to attack this protocol.

The protocol accepts user-provided tokens. Design a malicious token that:

Option A: Fee-on-transfer token
- Transfer sends less than expected
- Protocol accounting breaks

Option B: Reentrant token
- transfer() calls back into the protocol
- State is inconsistent during callback

Option C: Blacklisting token
- Selectively reverts transfers
- Causes denial of service

Option D: Rebasing token
- Balance changes without transfer
- Accounting mismatch over time

Option E: Pausable token
- Transfers pause mid-operation
- Funds locked

For each option, show exactly how the protocol breaks.

Target contract: [PASTE]
```

---

## Como Usar Este Sistema para Encontrar o que Outros Não Encontram

### Regra 1: Comece pelo que o desenvolvedor QUIS proteger

```
Pergunta: O que este contrato tenta garantir acima de tudo?
Resposta: [invariante principal]
Ataque: Como eu quebraria exatamente essa garantia?
```

### Regra 2: Encontre o estado mais improvável

```
Pergunta: Qual combinação de variáveis o desenvolvedor NUNCA esperou ver?
Resposta: [estado extremo]
Ataque: Como eu chegaria a esse estado?
```

### Regra 3: Modele o usuário como adversário perfeito

```
Pergunta: Se eu soubesse TUDO sobre este contrato e quisesse extrair o máximo,
          o que eu faria?
Resposta: [sequência de ações]
Verificação: Isso é possível? Quais precondições?
```

### Regra 4: Pergunte "e se o externo mentir?"

```
Para cada dependência externa:
- E se o token não transferir o que disse?
- E se o oracle retornar um preço fabricado?
- E se o contrato chamado fizer reentrância?
- E se o contrato chamado reverter na hora errada?
```

### Regra 5: Force as transições de estado inválidas

```
Para cada estado S e função F:
- F deveria ser inválida em S?
- Mas é possível chamar F em S?
- O que acontece se for?
```

---

## Estrutura de Hipótese para Salvar no Obsidian

```markdown
# Hypothesis: [título descritivo]

## Contract
[nome e contexto]

## Assumption Broken
[o que o desenvolvedor acreditava que era verdade]

## Why It's Wrong
[por que essa suposição pode ser violada]

## Preconditions
- [ ] condition 1
- [ ] condition 2

## Attack Path
1.
2.
3.

## Success Condition
[como saber que funcionou]

## Impact
[o que o atacante ganha]

## Novelty
[por que isso NÃO seria encontrado por Slither/Mythril]

## Test Result
- [ ] Confirmed
- [ ] Refuted
- [ ] Partial

## Notes
[observações durante o teste]
```

---

## Prompt de Meta-Raciocínio (o mais poderoso)

Use este quando os outros não encontrarem nada óbvio:

```
You have fully analyzed this contract and found no obvious vulnerabilities.

Now I want you to think differently.

Forget everything you know about smart contract security patterns.
Pretend you are a developer who built this contract.
You are proud of it. You believe it is secure.

Now: what would EMBARRASS you the most?
What would make you say "I can't believe I didn't think of that"?
What is the most creative, unexpected way this could be broken?

Think about:
- What you ASSUMED users would do vs what they COULD do
- What you ASSUMED about external systems vs what they MIGHT do
- What you assumed about TIMING that an adversary could violate
- What ECONOMIC behavior you didn't model

Give me 3 hypotheses that would embarrass the developer.
Make them specific, testable, and creative.

Contract: [PASTE]
```

---

## Usage Instructions

### When to Use Novel Discovery
- After standard vulnerability checks find nothing
- When auditing novel protocol designs
- When high security is critical (treasury, governance)
- During bug bounty triage for complex reports

### Workflow Integration
```
Standard Audit Pass
    ↓ (if nothing found OR for high-security targets)
Novel Discovery Pass
    ↓
Apply 6-Phase Framework
    ↓
Generate Hypotheses
    ↓
Rank by Feasibility
    ↓
Test Top 3
    ↓
Document Results in obsidian-vault/hypotheses/
```

### Success Metrics
- **Discovery Rate:** At least 1 novel hypothesis per complex contract
- **Validation Rate:** 20% of hypotheses should be exploitable
- **Novelty Score:** Hypothesis should not match known CVEs
- **Impact:** Exploitable hypotheses should have HIGH or CRITICAL impact

---

## Related Resources

- [[../obsidian-vault/invariant-catalog/defi-invariants]] — Common invariants to test
- [[../obsidian-vault/novel-patterns/pattern-mutation-framework]] — Pattern mutation strategies
- [[../obsidian-vault/hypotheses/_template]] — Hypothesis documentation template
- [[../obsidian-vault/failed-hypotheses/_template]] — Learn from failed attempts
