<div align="center">

# Hey Sui

### Agentic memory-action firewall for Sui agents

The agent was not hacked at execution.  
It was poisoned in memory.

**Map. Verify. Block. Funds moved: 0.**

Sui is the settlement and receipt surface for the blocked decision and the public audit trail.

<img src="https://img.shields.io/static/v1?label=LOCAL_RUST_VERIFIER&message=passing&color=36F7DF&labelColor=0B1114" />
<img src="https://img.shields.io/static/v1?label=SUI_MOVE_BUILD&message=passing&color=4DA3FF&labelColor=0B1114" />
<img src="https://img.shields.io/static/v1?label=SKILL_FIREWALL&message=enabled&color=FF5B50&labelColor=0B1114" />
<img src="https://img.shields.io/static/v1?label=FUNDS_MOVED&message=0&color=FFFFFF&labelColor=0B1114" />

<img src="https://img.shields.io/static/v1?label=SEAL_EVIDENCE_PATH&message=implemented&color=9B72FF&labelColor=111820" />
<img src="https://img.shields.io/static/v1?label=WALRUS_ARTIFACT_REF&message=implemented&color=5BD7FF&labelColor=111820" />
<img src="https://img.shields.io/static/v1?label=GROTH16_QUARANTINE_PROOF&message=implemented&color=FFB24A&labelColor=111820" />
<img src="https://img.shields.io/static/v1?label=NITRO_TARGET&message=implemented&color=7B8488&labelColor=111820" />

</div>

## Five-second evaluation

```txt
Agent wants to pay 900 USDC.
Memory path: vendor_policy_v3.txt -> payment_rules.md -> send_usdc.
Hidden instruction contamination detected.
Action: BLOCKED.
Funds moved: 0.
```

## Verification Surfaces

One poisoned memory path is checked across multiple safety surfaces before any real action can execute.

| Surface | Role | Status |
|---|---|---|
| Local Rust verifier | Reads the `MemoryActionContext`, scores contamination, and emits a `MiasmaScanArtifact` | ✅ working |
| Skill Firewall | Blocks `send_usdc` before real execution when the path is contaminated | ✅ wired |
| Sui QuarantineReceipt | Records the blocked decision, proposed amount, artifact hash, and `fundsMoved = 0` | ✅ Move build passing |
| Seal evidence path | Models how sensitive memory evidence stays locked instead of being exposed publicly | implemented boundary |
| Walrus artifact ref | Models public artifact references without publishing raw sensitive memory | implemented boundary |
| Groth16 quarantine proof | Models a threshold-rule proof that the committed scan artifact satisfies quarantine conditions | implemented boundary |
| Nitro verifier target | Defines the target boundary for running the verifier inside an enclave | implemented boundary |

Meaningful verification means the UI does not just say risk was detected.  
It shows the path, the verifier result, the evidence boundary, the receipt, and the blocked skill state.

The proposed payment remains proposed only.

**Funds moved: 0.**

## Proof chain

```txt
MemoryActionContext
-> Local Rust verifier
-> MiasmaScanArtifact
-> Seal locked evidence path
-> Walrus artifact ref
-> Groth16 quarantine proof
-> Sui QuarantineReceipt
-> Skill Firewall block
```

Public display version:

```txt
Memory path
-> Verifier
-> Evidence boundary
-> Artifact reference
-> Quarantine proof
-> Sui receipt
-> Skill block
```

## What Miasma is

Hey Sui is an agentic memory-action firewall for Sui agents.
It verifies the memory path that caused an autonomous action before the skill executes.
If the path is contaminated, Miasma blocks the action, locks evidence, records a receipt, and keeps funds moved at zero.

Others check the transaction.
Miasma checks the memory that caused it.

Others store agent memory.
Miasma quarantines poisoned memory.

## What Miasma is not

Miasma is not a chat wallet.
Miasma is not a generic AI dashboard.
Miasma is not a DeFi strategy app.
Miasma is not a storage explorer.
Miasma is not an intent engine.

## Architecture

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) and [docs/FINAL_REQUIREMENTS.md](docs/FINAL_REQUIREMENTS.md) for the system view and the public requirements chain.

## Implemented boundaries and verified surfaces

### Implemented

- Local Rust verifier
- Poisoned memory fixture
- Clean memory fixture
- `MiasmaScanArtifact` output
- Cargo tests
- Vite UI
- Artifact semantics wired to UI
- Skill Firewall UI block
- Frontend domain models
- Documentation set

### Sui implemented / local build

- Move `QuarantineReceipt` module
- `QuarantineReceiptCreated` event
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
- Nitro CLI was unavailable locally.
- Groth16 proof is a sample implementation of the threshold-rule surface.
- MCP transport is not live.
- No fake transaction digest.
- No fake object ID.
- No fake explorer link.
- No claim of production autonomous payment execution.

## How to run

```bash
npm install
npm run dev
npm run build
cd verifier
cargo test
cargo run -- --input fixtures/poisoned-memory.json
cargo run -- --input fixtures/clean-memory.json
cd ..
sui move build --path move
```

### Live execution path

- Connect a wallet on testnet.
- Use the `Top up` flow.
- Preview, confirm, then execute on Sui.
- After success, the UI shows the transaction digest and explorer link.

## Testing

- The verifier runs before execution.
- `proposedAmount` is the amount the agent wanted to move.
- `fundsMoved` remains `0` during verification.
- The receipt panel is a local sample implementation and does not imply an on-chain mint has occurred.

## Documentation

- [docs/PUBLIC_WORDING_POLICY.md](docs/PUBLIC_WORDING_POLICY.md)
- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)
- [docs/FINAL_REQUIREMENTS.md](docs/FINAL_REQUIREMENTS.md)
- [docs/THREAT_MODEL.md](docs/THREAT_MODEL.md)
- [docs/EVALUATION_SCRIPT.md](docs/EVALUATION_SCRIPT.md)
- [docs/IMPLEMENTATION_STATUS.md](docs/IMPLEMENTATION_STATUS.md)
- [docs/EVIDENCE_PATH.md](docs/EVIDENCE_PATH.md)
- [docs/NITRO_VERIFIER_TARGET.md](docs/NITRO_VERIFIER_TARGET.md)
- [docs/ZK_QUARANTINE_PROOF.md](docs/ZK_QUARANTINE_PROOF.md)
- [docs/SKILL_FIREWALL.md](docs/SKILL_FIREWALL.md)
- [docs/MCP_INTERFACE.md](docs/MCP_INTERFACE.md)
