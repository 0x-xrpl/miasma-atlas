# Threat Model

Miasma Atlas focuses on pre-execution memory-action quarantine for agent skills.

This threat model complements [docs/FINAL_REQUIREMENTS.md](FINAL_REQUIREMENTS.md) and keeps the public documentation aligned with the runtime semantics.

## Threats handled

- stored prompt injection
- hidden instruction contamination
- poisoned vendor policy
- stale payment rule
- recipient substitution
- tool permission escalation
- skill manifest mismatch
- memory drift
- high-value action triggered by contaminated context
- raw memory leakage
- artifact forgery
- frontend-only trust
- operator tampering

## Threats not fully solved in the demo

- malicious LLM internals
- full formal verification
- production KMS enforcement
- real-time cross-agent collusion
- production Seal / Walrus / Nitro deployment

## Security boundary

The verifier runs before execution. If the memory path is poisoned, the action is blocked, evidence is retained as hashes and scaffolded refs, and funds moved remains `0`.

## Trust posture

The current demo is honest about its boundaries:

- local verifier is real
- receipt and proof layers are scaffolded where noted
- no production on-chain mint is claimed
- no production enclave or ZK proof is claimed
