# Miasma Atlas Architecture

Miasma Atlas is an agentic memory-action firewall for Sui agents. It verifies the memory path that caused an agent action before the skill executes. If the path is poisoned, Miasma blocks the action, locks evidence, records a receipt, and keeps funds moved at `0`.

For the public requirements, demo language, and visual hierarchy, see [docs/FINAL_REQUIREMENTS.md](FINAL_REQUIREMENTS.md).

## Layered architecture

### UI Layer
- Presents the map-first demo.
- Shows the agent action, memory path, proof panel, receipt scaffold, and firewall state.

### Artifact Layer
- Produces the local `MiasmaScanArtifact`.
- Captures `proposedAmount`, `contaminationScore`, `actionBlocked`, `fundsMoved`, `recommendation`, `infectedPath`, and `detectorResults`.

### Rust Verifier Layer
- Runs the local scanner against poisoned and clean fixtures.
- Produces the working JSON artifact used by the UI.

### Receipt Layer
- Models the public `Sui QuarantineReceipt`.
- Stores hashes, refs, scores, and decisions.

### Evidence Layer
- Models Seal-locked evidence.
- Models Walrus artifact references.
- Keeps raw memory hidden.

### Nitro Target Layer
- Scaffolds the isolated Nitro Enclave execution target.
- Describes the same verifier boundary running inside an enclave.

### Groth16 Proof Layer
- Scopes proof to the quarantine threshold rule only.
- Does not prove the full scan or reveal sensitive evidence.

### Agent Runtime / Skill Firewall Layer
- Builds the `MemoryActionContext`.
- Evaluates skill manifests and tool permissions.
- Blocks contaminated skill use before execution.

### MCP Interface Layer
- Documents the intended tool surface for the runtime and firewall.
- Remains scaffold-only.

## End-to-end chain

```txt
Agent SkillUseRequest
-> MemoryActionContext
-> Rust verifier
-> MiasmaScanArtifact
-> EvidencePath
-> QuarantineProof
-> QuarantineReceipt
-> SkillUseRecord
```

## What is implemented

- Local Rust verifier
- Vite UI reading artifact semantics
- Sui QuarantineReceipt frontend model
- Sui Move QuarantineReceipt module
- Seal / Walrus evidence path scaffold
- Nitro verifier target scaffold
- Groth16 quarantine proof scaffold
- Agent Runtime / Skill Firewall scaffold
- MCP interface docs

## What is scaffolded

- Seal encryption path
- Walrus artifact routing
- Nitro execution target
- Groth16 proof layer
- MCP interface transport
- frontend on-chain mint wiring

## What is not claimed

- Production Seal encryption is not live
- Real Walrus upload is not live
- Nitro CLI was unavailable locally
- Groth16 proof is sample/scaffold only
- MCP transport is not live
- No fake transaction digest
- No fake SuiVision link
