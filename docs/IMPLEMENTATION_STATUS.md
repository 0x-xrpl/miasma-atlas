# Implementation Status

For the public product definition and visual hierarchy, see [docs/FINAL_REQUIREMENTS.md](FINAL_REQUIREMENTS.md).

## Implemented now

- Local Rust verifier
- Poisoned and clean fixtures
- Cargo tests
- `MiasmaScanArtifact` JSON
- Vite UI reading artifact semantics
- Sui QuarantineReceipt frontend model
- Sui Move QuarantineReceipt module
- Seal / Walrus evidence path scaffold
- Nitro verifier target scaffold
- Groth16 quarantine proof scaffold
- Agent Runtime / Skill Firewall scaffold
- MCP interface docs

## Scaffolded now

- Seal encryption path
- Walrus artifact routing
- Nitro execution target
- Groth16 proof layer
- MCP transport
- frontend on-chain mint wiring

## Not claimed

- Production Seal encryption
- Real Walrus upload
- Nitro production execution
- Real enclave attestation
- Real Groth16 proof generation
- Live MCP server
- On-chain mint wiring
- Real SuiVision link
- Fake transaction digest

## Design rule

The verifier runs before execution. `proposedAmount` is the amount the agent wanted to move. `fundsMoved` remains `0` during verification.
