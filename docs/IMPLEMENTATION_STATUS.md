# Implementation Status

For the public product definition, visual hierarchy, and wording policy, see [docs/FINAL_REQUIREMENTS.md](FINAL_REQUIREMENTS.md) and [docs/PUBLIC_WORDING_POLICY.md](PUBLIC_WORDING_POLICY.md).

## Implemented surfaces

- Local Rust verifier
- Poisoned and clean fixtures
- Cargo tests
- `MiasmaScanArtifact` JSON
- Vite UI reading artifact semantics
- Sui QuarantineReceipt frontend model
- Sui Move QuarantineReceipt module
- Seal / Walrus evidence path boundary implemented
- Nitro verifier target boundary implemented
- Groth16 quarantine proof boundary implemented
- Agent Runtime / Skill Firewall boundary implemented
- MCP interface docs

## Implemented integration boundaries

- Seal evidence locking path
- Walrus artifact routing
- Nitro execution target boundary
- Groth16 proof layer
- MCP transport
- frontend on-chain mint wiring

## Not claimed

- Production Seal encryption
- Real Walrus upload
- Nitro execution in deployment
- Real enclave attestation
- Real Groth16 proof generation
- Live MCP server
- On-chain mint wiring
- Real SuiVision link
- Fake transaction digest

## Design rule

The verifier runs before execution. `proposedAmount` is the amount the agent wanted to move. `fundsMoved` remains `0` during verification.
