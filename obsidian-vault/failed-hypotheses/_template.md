# Failed Hypothesis Template

tags: #failed-hypothesis #template #learning

---

## Hypothesis
[One sentence describing the attempted attack]

## Contract
[Nome do Contrato] — [Address if deployed]

---

## What Was Tested
[Description of the attack vector that was attempted]

## Attack Steps Attempted
```
1. [Step taken]
2. [Step taken]
3. [Step taken]
```

---

## Why It Failed

### Technical Reason
[The specific code, check, or condition that prevented the attack]

### Code Reference
```solidity
// The line or function that blocked the attack
```

### Root Cause Category
- [ ] Validation check present
- [ ] Access control blocked
- [ ] State transition invalid
- [ ] Economic assumptions wrong
- [ ] Timing constraints
- [ ] Protocol design prevents it
- [ ] Other: [specify]

---

## Lessons Learned

### About This Contract
[What this tells us about the contract's security]

### Pattern Recognition
[What to look for in future audits — "this pattern prevents X"]

### Alternative Angles
[Ways this could still be exploitable or related attack vectors to try]

---

## Related Hypotheses
- [[hypotheses/]] — Successful hypothesis on same contract
- [[attack-patterns/]] — Pattern this relates to

---

## Metadata
- **Date:** [When tested]
- **Auditor:** [Name]
- **Time Invested:** [How long spent on this hypothesis]
- **Confidence Before:** [High/Medium/Low]
- **Confidence After:** [Confirmed refuted]

---

## Notes
[Any additional observations, traces, or context]
