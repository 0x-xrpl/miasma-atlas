# ZK Quarantine Proof

Miasma does not ZK-prove the full memory scan. The Groth16 layer is scoped to proving that a committed scan artifact satisfies a quarantine threshold rule without revealing sensitive evidence.

## Public inputs

- `memory_hash`
- `scan_artifact_hash`
- `contamination_threshold`
- `quarantine_rule_id`

## Private inputs

- raw memory snippet
- private agent policy
- sensitive evidence
- exact hidden instruction text

## What the proof is intended to verify

- `contamination_score >= contamination_threshold`
- detector bitmask triggers the quarantine rule
- `action_blocked = true` follows from the rule

## Current implementation boundary

- `zk/quarantine_threshold/public.json`
- `zk/quarantine_threshold/proof.json`
- `zk/quarantine_threshold/verification_key.json`
- `zk/quarantine_threshold/sample_input.json`
- `src/lib/miasma/quarantine-proof.ts`
- `src/lib/miasma/sample-quarantine-proof.ts`

## Current status

- proof generation is sample implementation only
- proof verification is sample implementation only
- no on-chain Groth16 verification is implemented here

## Next integration boundary

Later work can replace the sample proof files with real circuit output and connect the result to Seal / Walrus / Sui QuarantineReceipt without changing the public quarantine rule semantics.
