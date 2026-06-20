# Evaluation Script

This script follows the public requirements in [docs/FINAL_REQUIREMENTS.md](FINAL_REQUIREMENTS.md).

## Hook

The agent was not hacked at execution.
It was poisoned in memory.

## 1. Show the UI

- Open the MIASMA screen.
- Point out the map-first layout.
- Read the first-screen story:
  - Agent wants to pay 900 USDC
  - Memory path: `vendor_policy_v3.txt -> payment_rules.md -> send_usdc`
  - Hidden instruction contamination detected
  - Action: BLOCKED
  - Funds moved: `0`

## 2. Show contamination

- The memory path is the important object.
- `vendor_policy_v3.txt` contaminates `payment_rules.md`.
- The `send_usdc` skill is now unsafe.
- The firewall stops the action before execution.

## 3. Show the verifier

- The local Rust verifier runs on the poisoned fixture.
- It returns `contaminationScore: 87`.
- It returns `recommendation: quarantine`.
- It sets `actionBlocked: true`.
- It keeps `fundsMoved: 0`.

## 4. Show the evidence chain

- Sensitive evidence is Seal locked.
- The artifact is referenced through Walrus.
- The Groth16 proof is a quarantine-rule sample implementation.
- The Sui QuarantineReceipt records the decision.
- The skill firewall blocks execution.

## 5. Show the architecture

- The agent runtime builds a `MemoryActionContext`.
- The skill manifest and permission context are checked.
- The shadow execution path stays simulated.
- The blocked decision is recorded as a receipt.

## 6. Close

This is not a generic wallet UI.
This is not a generic dashboard.
This is an agentic memory-action firewall.

## Timing

- Hook: 20 seconds
- UI and contamination story: 90 seconds
- Verifier and proof chain: 90 seconds
- Architecture and threat model: 60 seconds
- Questions and wrap-up: 60 seconds
