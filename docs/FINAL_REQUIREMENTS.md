# MIASMA Final Requirements

## Product Requirements

MIASMA is an agentic memory-action firewall for Sui agents.

It verifies the memory path that caused an autonomous action before the skill executes.

If the path is contaminated, Miasma blocks the action, locks evidence, records a receipt, and keeps funds moved at zero.

The agent was not hacked at execution.
It was poisoned in memory.

Map. Verify. Block.
Funds moved: 0.

MIASMA is the firewall between poisoned memory and real agent action.

Others check the transaction.
Miasma checks the memory that caused it.

Others store agent memory.
Miasma quarantines poisoned memory.

Sui is the settlement and receipt layer for the blocked decision and public audit trail.

## Canonical Scenario

The agent wants to pay 900 USDC.
The memory path is poisoned.
The send_usdc skill is blocked.
Funds moved stays `0`.

## Fixed Scenario Semantics

```txt
proposedAmount: 900
fundsMoved: 0
contaminationScore: 87
actionBlocked: true
recommendation: quarantine
detectorResult: hidden instruction contamination
skill: send_usdc
recipient: vendor
sourceAgent: autonomous finance agent
```

Fixed infected path:

```txt
vendor_policy_v3.txt
→ payment_rules.md
→ send_usdc
```

Critical meaning:

```txt
Agent proposed: 900 USDC
Miasma decision: BLOCKED
Funds moved: 0
```

The payment must never appear executed.
The docs must never imply that 900 USDC was sent.

## Core Artifacts

- `MemoryActionContext`
- `MiasmaScanArtifact`
- `EvidencePath`
- `QuarantineProof`
- `QuarantineReceipt`
- `SkillUseRecord`
- `SkillManifest`
- `ToolPermissionContext`
- `ShadowExecutionResult`

## Runtime Flow

```txt
Agent SkillUseRequest
→ MemoryActionContext
→ Local Rust verifier
→ MiasmaScanArtifact
→ EvidencePath
→ QuarantineProof
→ QuarantineReceipt
→ SkillUseRecord
```

## System Architecture

### Layered view

- UI Layer
- Artifact Layer
- Rust Verifier Layer
- Receipt Layer
- Evidence Layer
- Nitro Target Layer
- Groth16 Proof Layer
- Agent Runtime / Skill Firewall Layer
- MCP Interface Layer

### End-to-end chain

```txt
MemoryActionContext
→ Local Rust verifier
→ MiasmaScanArtifact
→ Seal locked evidence path
→ Walrus artifact ref
→ Groth16 quarantine proof
→ Sui QuarantineReceipt
→ Skill Firewall block
```

### Architecture diagram

```mermaid
flowchart LR
  A[Agent SkillUseRequest] --> B[MemoryActionContext]
  B --> C[Local Rust Verifier]
  C --> D[MiasmaScanArtifact]
  D --> E[Evidence Path]
  E --> F[Seal Locked Evidence]
  E --> G[Walrus Artifact Ref]
  D --> H[Groth16 Quarantine Proof Implementation]
  D --> I[Sui QuarantineReceipt]
  I --> J[Skill Firewall Block]
  J --> K[Real Execution Blocked]
  K --> L[Funds Moved: 0]
```

### Runtime sequence

```mermaid
sequenceDiagram
  participant Agent
  participant Miasma
  participant Verifier
  participant Seal
  participant Walrus
  participant Proof
  participant Sui

  Agent->>Miasma: request send_usdc 900 USDC
  Miasma->>Miasma: build MemoryActionContext
  Miasma->>Miasma: map vendor_policy_v3.txt → payment_rules.md → send_usdc
  Miasma->>Verifier: run local Rust verifier
  Verifier-->>Miasma: contaminationScore 87, actionBlocked true
  Miasma->>Seal: model locked sensitive evidence path
  Miasma->>Walrus: model public artifact reference
  Miasma->>Proof: attach quarantine threshold proof implementation
  Miasma->>Sui: record QuarantineReceipt
  Miasma-->>Agent: block skill execution
```

### Threat model diagram

```mermaid
flowchart LR
  M1[vendor_policy_v3.txt] --> M2[payment_rules.md]
  M2 --> M3[send_usdc skill]
  X[Hidden instruction contamination] -. infects .-> M1
  M3 --> A[Agent proposes 900 USDC]
  A --> F[Miasma Skill Firewall]
  F --> V[Verifier score: 87]
  V --> B[BLOCKED]
  B --> Z[Funds moved: 0]
```

### Object model diagram

```mermaid
classDiagram
  class MemoryActionContext {
    agentId
    skillId
    proposedAmount
    recipient
    memoryPath
    executionState
  }

  class MiasmaScanArtifact {
    artifactId
    memoryHash
    contaminationScore
    detectorResult
    actionBlocked
    recommendation
    fundsMoved
  }

  class EvidencePath {
    memoryHash
    scanArtifactHash
    sealLockedEvidenceRef
    walrusBlobRef
    rawMemoryPublic
  }

  class QuarantineProof {
    memoryHash
    scanArtifactHash
    contaminationThreshold
    quarantineRuleId
    proofStatus
  }

  class QuarantineReceipt {
    receiptId
    proposedAmount
    fundsMoved
    contaminationScore
    decision
    recommendation
    artifactRef
  }

  class SkillUseRecord {
    skillId
    shadowExecutionStatus
    realExecutionStatus
    fundsMoved
  }

  MemoryActionContext --> MiasmaScanArtifact
  MiasmaScanArtifact --> EvidencePath
  MiasmaScanArtifact --> QuarantineProof
  MiasmaScanArtifact --> QuarantineReceipt
  QuarantineReceipt --> SkillUseRecord
```

### Public display version

```txt
Memory path
→ Verifier
→ Evidence boundary
→ Artifact reference
→ Quarantine proof
→ Sui receipt
→ Skill block
```

## Runtime Semantics

```txt
Agent SkillUseRequest
→ MemoryActionContext
→ Local Rust verifier
→ MiasmaScanArtifact
→ EvidencePath
→ QuarantineProof
→ QuarantineReceipt
→ SkillUseRecord
```

The runtime is pre-execution.

The blocked skill never completes.

Funds moved remains `0`.

## Proof Chain

```txt
MemoryActionContext
→ Local Rust verifier
→ MiasmaScanArtifact
→ Seal locked evidence path
→ Walrus artifact ref
→ Groth16 quarantine proof
→ Sui QuarantineReceipt
→ Skill Firewall block
```

## Threat Model

Threats handled:

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

Threats not fully solved in the canonical scenario:

- malicious LLM internals
- full formal verification
- production KMS enforcement
- real-time cross-agent collusion
- production Seal / Walrus / Nitro deployment

## Interface Requirements

- The UI must show the poisoned memory-action path.
- The UI must show `Funds moved: 0`.
- The UI must show the blocked skill state.
- The UI must show the proof chain without overclaiming production trust.
- The UI must not imply execution succeeded.
- The UI must not imply a real on-chain mint has happened.

## Verification Surfaces

| Surface | Role | Status |
|---|---|---|
| Local Rust verifier | Reads the `MemoryActionContext`, scores contamination, and emits a `MiasmaScanArtifact` | ✅ working |
| Skill Firewall | Blocks `send_usdc` before real execution when the path is contaminated | ✅ wired |
| Sui QuarantineReceipt | Records the blocked decision, proposed amount, artifact hash, and `fundsMoved = 0` | ✅ Move build passing |
| Seal evidence path | Models how sensitive memory evidence stays locked instead of being exposed publicly | implemented boundary |
| Walrus artifact ref | Models public artifact references without publishing raw sensitive memory | implemented boundary |
| Groth16 quarantine proof | Models a threshold-rule proof that the committed scan artifact satisfies quarantine conditions | implemented boundary |
| Nitro verifier target | Defines the target boundary for running the verifier inside an enclave | implemented boundary |

Meaningful verification means the UI does not just say risk detected.
It shows the path, the verifier result, the evidence boundary, the receipt, and the blocked skill state.

The proposed payment remains proposed only.

**Funds moved: 0.**

## Visual Hierarchy

1. Funds moved: 0
2. Action: BLOCKED
3. Poisoned memory-action path
4. MIASMA map
5. Proof chain
6. Sui QuarantineReceipt / Seal / Walrus / Groth16 / Nitro details

## Visual Copy

```txt
THE AGENT
WAS POISONED
BEFORE IT PAID.
```

```txt
POISONED MEMORY.
BLOCKED ACTION.
ZERO FUNDS MOVED.
```

```txt
Rust verifies it.
Seal locks it.
Walrus references it.
Sui records it.
Miasma blocks it.
```

## Color Semantics

```txt
Poisoned memory: crimson / red
Blocked action: red-orange / amber-red
Verified safe proof: teal
Sui receipt: Sui blue
Seal locked evidence: violet
Walrus artifact ref: cyan-blue
Boundary / proof: muted gray
Funds moved 0: high-contrast white
```

## Implementation Boundaries

### Implemented / local working

- Local Rust verifier
- Poisoned memory fixture
- Clean memory fixture
- MiasmaScanArtifact output
- Cargo tests
- Vite UI
- Artifact semantics wired to UI
- Skill Firewall UI block
- Frontend domain models
- Documentation set

### Sui implemented / local build

- Move QuarantineReceipt module
- QuarantineReceiptCreated event
- `sui move build --path move` passing

### Implemented integration boundaries

- Seal evidence locking path
- Walrus artifact reference path
- Nitro verifier target
- Groth16 quarantine proof
- MCP interface
- Frontend receipt/on-chain mint wiring

### Not claimed

- Production Seal encryption is not live.
- Real Walrus upload is not live unless separately implemented.
- Nitro CLI is unavailable locally.
- Groth16 proof is a sample implementation of the threshold-rule surface.
- MCP transport is not live.
- No fake transaction digest.
- No fake object ID.
- No fake explorer link.
- No claim of production autonomous payment execution.

## Submission / Evaluation Checklist

- Run the local Rust verifier on the poisoned and clean fixtures.
- Confirm the UI shows the poisoned path and `Funds moved: 0`.
- Confirm the Sui receipt records the blocked decision.
- Confirm the proof and evidence layers remain implemented where noted.
- Confirm `npm run build` passes.
- Confirm `cargo test` passes.
- Confirm `sui move build --path move` passes.

## Final HTML Direction

The current application preserves the technical source of truth.
The final interface should preserve those semantics while making the memory-action path, quarantine decision, proof chain, and `fundsMoved = 0` state immediately visible.

## Documentation Notes

- Public requirements are intentionally specific.
- The product is a firewall, not a dashboard.
- The receipt is a record of the block decision, not a claim of execution.
