# Manual Test Checklist

This checklist tracks the same runtime semantics described in [docs/FINAL_REQUIREMENTS.md](docs/FINAL_REQUIREMENTS.md).

Checklist:
1. Run `npm install`.
2. Run `npm run dev`.
3. Open the app.
4. Confirm the first-screen demo reads as Hey Sui and not the legacy copied app.
5. Confirm the quarantine status shows `BLOCKED`.
6. Confirm the memory path mentions `vendor_policy_v3.txt -> payment_rules.md -> send_usdc`.
7. Confirm the verifier runs before execution, `proposedAmount` reflects intent, and `fundsMoved` stays `0`.
8. Confirm the skill firewall section shows `send_usdc`, shadow execution as simulated, real execution as blocked, and `Funds moved: 0`.
9. Run `cd verifier && cargo run -- --input fixtures/poisoned-memory.json` and confirm it emits `MiasmaScanArtifact` JSON.
10. Run `cd verifier && cargo run -- --input fixtures/clean-memory.json` and confirm it emits a clean `MiasmaScanArtifact` JSON.
11. Run `cd verifier && cargo test` and confirm the verifier tests pass.
12. Run `npm run build` and confirm the Vite build passes.
13. Run `sui move build --path move` and confirm the Move package builds.
14. Confirm the receipt panel is a local scaffold and does not imply an on-chain mint already occurred.
15. Connect a testnet wallet, use the `Top up` flow, confirm the command, and verify the live testnet transfer shows a transaction digest and explorer link.
16. Run `npm run tee:capture` with a real Nitro runtime output path and confirm it only succeeds with a real attestation document source.
17. Run `npm run tee:verify` with a real attestation document path and expected PCR JSON and confirm it only reports verified when the real document matches.

Production status:

| Surface | Status |
|---|---|
| Sui transfer | live |
| DeepBook testnet execution | live |
| Groth16 prove + verify | live locally |
| Verified Evidence Capsule chain | implemented, gated by Walrus, Seal, and Sui capsule config |
| Nitro/TEE capture + verify path | implemented, requires a real AWS Nitro attestation document |
| Walrus / Seal | not claimed live |
